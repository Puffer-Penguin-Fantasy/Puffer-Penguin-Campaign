import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount, useWallet } from '@razorlabs/razorkit';
import { LogOut, CheckCircle2, Lock, ShieldCheck, ExternalLink, Copy, Link2, Gamepad2, Trophy } from 'lucide-react';
import { useArcticPenguin } from '../../hooks/useArcticPenguin';
import { FastAverageColor } from 'fast-average-color';
import { getTotalReferrals } from '../../services/referralService';
import { useSound } from '../../hooks/useSound';
import { LevelUpOverlay } from '../effects/LevelUpOverlay';
import { getAllQuestStatuses, saveQuestStatus, QuestStatus } from '../../services/questService';

const fac = new FastAverageColor();

interface QuestCardProps {
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
  icon: React.ReactNode;
  points: number;
  onAction?: () => void;
  actionText?: string;
  isVerifying?: boolean;
}

const QuestCard: React.FC<QuestCardProps> = ({ 
  title, description, isCompleted, isLocked, icon, points, onAction, actionText, isVerifying 
}) => {
  const { playClick } = useSound();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-[24px] transition-all ${
        isLocked ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className={`p-1 ${isCompleted ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
        <div className="glass p-5 sm:p-6 rounded-[22px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              isCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/40'
            }`}>
              {isCompleted ? <CheckCircle2 size={28} /> : isLocked ? <Lock size={28} /> : icon}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                <h3 className="text-lg sm:text-xl font-medium">
                  {title}
                </h3>
                <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-md border whitespace-nowrap ${
                  isCompleted ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-white/10 text-white/40'
                }`}>
                  +{points} PTS
                </span>
                {isCompleted && <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold shadow-lg">Verified</span>}
              </div>
              <p className="text-white/40 text-[13px] sm:text-sm leading-relaxed">{description}</p>
            </div>
          </div>

          {!isCompleted && !isLocked && actionText && (
            <button
              onClick={() => { playClick(); onAction?.(); }}
              className="rainbow-border w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-white font-medium flex items-center justify-center gap-2 hover:scale-[1.05] transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              {isVerifying ? (
                <>Verify Now <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" /></>
              ) : (
                <>{actionText} <span className="text-white/60">→</span></>
              )}
            </button>
          )}

          {isLocked && (
            <div className="text-white/20">
              <Lock size={20} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const Dashboard: React.FC = () => {
  const { address } = useAccount();
  const { disconnect } = useWallet();
  const { playClick, playPointGained } = useSound();
  const { data: arcticData, isLoading: arcticLoading } = useArcticPenguin(address);
  const [q2Status, setQ2Status] = useState<QuestStatus>('idle');
  const [q3Status, setQ3Status] = useState<QuestStatus>('idle');
  const [q4Status, setQ4Status] = useState<QuestStatus>('idle');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [lastLevelUpInfo, setLastLevelUpInfo] = useState<{ name: string; points: number } | null>(null);
  const [glowColor, setGlowColor] = useState<string | null>(null);

  // Persist mission states to Firebase
  useEffect(() => {
    if (!address) return;

    const fetchStatuses = async () => {
      const statuses = await getAllQuestStatuses(address);
      if (statuses['follow-arctic']) setQ2Status(statuses['follow-arctic']);
      if (statuses['follow-column']) setQ3Status(statuses['follow-column']);
      if (statuses['join-discord']) setQ4Status(statuses['join-discord']);
    };

    fetchStatuses();
  }, [address]);

  // Extract dominant color from NFT image for dynamic background
  useEffect(() => {
    if (arcticData.nftDetails?.image) {
      fac.getColorAsync(arcticData.nftDetails.image, { crossOrigin: 'anonymous' })
        .then(color => {
          setGlowColor(color.hex);
        })
        .catch(e => {
          console.warn('Could not extract color for glow (CORS or image error):', e);
          setGlowColor(null);
        });
    } else {
      setGlowColor(null);
    }
  }, [arcticData.nftDetails?.image]);

  const handleFollow = async (url: string, statusSetter: (s: QuestStatus) => void, questName: string, points: number, questId: string, currentStatus: QuestStatus) => {
    if (currentStatus === 'verifying') {
      // Manual verification trigger
      statusSetter('completed');
      if (address) {
        await saveQuestStatus(address, questId, 'completed');
      }
      
      // Calculate count *after* this completion
      const newCount = (arcticData.hasNFT ? 1 : 0) + 
                       (q2Status === 'completed' || statusSetter === setQ2Status ? 1 : 0) + 
                       (q3Status === 'completed' || statusSetter === setQ3Status ? 1 : 0) + 
                       (q4Status === 'completed' || statusSetter === setQ4Status ? 1 : 0);

      // Trigger level up if it's the 1st milestone (Init) or every 4th thereafter (5, 9, 13...)
      if (newCount === 1 || (newCount > 1 && (newCount - 1) % 4 === 0)) {
        setLastLevelUpInfo({ name: questName, points: points });
        setShowLevelUp(true);
      }
      playPointGained();
      return;
    }

    // Initial click: Open URL and set to verifying
    window.open(url, '_blank');
    statusSetter('verifying');
    if (address) {
      await saveQuestStatus(address, questId, 'verifying');
    }
  };

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  const [totalReferrals, setTotalReferrals] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (address && arcticData.hasNFT) {
      getTotalReferrals(address).then(setTotalReferrals);
    }
  }, [address, arcticData.hasNFT]);

  const referralLink = `${window.location.origin}/?ref=${address}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalPoints = (arcticData.hasNFT ? 100 : 0) +
                     (q2Status === 'completed' ? 50 : 0) +
                     (q3Status === 'completed' ? 50 : 0) +
                     (q4Status === 'completed' ? 50 : 0) +
                     (totalReferrals * 100);

  const completedQuestCount = (arcticData.hasNFT ? 1 : 0) + 
                             (q2Status === 'completed' ? 1 : 0) + 
                             (q3Status === 'completed' ? 1 : 0) + 
                             (q4Status === 'completed' ? 1 : 0);
  
  const currentLevel = completedQuestCount === 0 ? 0 : Math.floor((completedQuestCount - 1) / 4) + 1;

  const quests = [
    {
      id: 'hold-nft',
      title: 'Hold Arctic Penguin NFT',
      description: 'Own the official Campaign Badge to unlock the full ecosystem.',
      isCompleted: arcticData.hasNFT,
      isLocked: false,
      points: 100,
      icon: <ShieldCheck size={28} />,
      actionText: 'Mint Now',
      onAction: () => window.open('https://movement.tradeport.xyz', '_blank')
    },
    {
      id: 'follow-arctic',
      title: 'Follow @arctic_pengu1n',
      description: 'Join the colony on X to stay updated on the latest drops.',
      isCompleted: q2Status === 'completed',
      isLocked: !arcticData.hasNFT, // Unlock after NFT
      isVerifying: q2Status === 'verifying',
      points: 50,
      icon: <Link2 size={28} />,
      actionText: 'Follow on X',
      onAction: () => handleFollow('https://x.com/arctic_pengu1n', setQ2Status, 'Follow @arctic_pengu1n', 50, 'follow-arctic', q2Status)
    },
    {
      id: 'follow-column',
      title: 'Follow @ColumnWallet',
      description: 'Follow the official wallet of the Movement network.',
      isCompleted: q3Status === 'completed',
      isLocked: q2Status !== 'completed', // Unlock after Quest 2
      isVerifying: q3Status === 'verifying',
      points: 50,
      icon: <Link2 size={28} />,
      actionText: 'Follow on X',
      onAction: () => handleFollow('https://x.com/ColumnWallet', setQ3Status, 'Follow @ColumnWallet', 50, 'follow-column', q3Status)
    },
    {
      id: 'join-discord',
      title: 'Join Discord',
      description: 'Join the official Discord community to connect with other penguins.',
      isCompleted: q4Status === 'completed',
      isLocked: q3Status !== 'completed', // Unlock after Quest 3
      isVerifying: q4Status === 'verifying',
      points: 50,
      icon: <Gamepad2 size={28} />,
      actionText: 'Join Discord',
      onAction: () => handleFollow('https://discord.gg/YZWFYRJ2D', setQ4Status, 'Join Discord', 50, 'join-discord', q4Status)
    }
  ];

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-24 px-6 max-w-7xl mx-auto relative z-10"
    >
      {/* Dynamic Header Glow */}
      <AnimatePresence>
        {glowColor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed top-0 left-0 right-0 h-[800px] pointer-events-none -z-10"
            style={{
              background: `radial-gradient(ellipse at top, ${glowColor} 0%, transparent 60%)`
            }}
          />
        )}
      </AnimatePresence>

      <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-medium mb-4">Missions</h1>
          <p className="text-white/40 text-[20px]">Complete missions to unlock exclusive rewards.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {address && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { playClick(); disconnect(); }}
              className="rainbow-border px-4 sm:px-8 py-2.5 sm:py-3 rounded-full flex items-center gap-2 sm:gap-3 font-mono text-xs sm:text-sm font-medium group transition-all"
            >
              <span className="rainbow-text font-bold text-[14px] sm:text-[16px] mr-1 sm:mr-2">
                {totalPoints.toLocaleString()} PTS
              </span>
              <span className="text-white/90 group-hover:text-white transition-colors">
                {shortAddress}
              </span>
              <div className="w-px h-3 sm:h-4 bg-white/20" />
              <LogOut size={14} className="text-white/40 group-hover:text-white transition-colors" />
            </motion.button>
          )}
        </div>
      </header>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* NFT & Referral Cards (First on mobile) */}
        <div className="order-1 lg:order-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-[32px] overflow-hidden p-8 sticky top-24"
          >
            <div className="aspect-square rounded-[24px] overflow-hidden mb-8 relative group bg-white/5 flex items-center justify-center">
              {arcticData.nftDetails?.image ? (
                <img 
                  src={arcticData.nftDetails.image} 
                  alt="Your NFT" 
                  crossOrigin="anonymous"
                  className={`w-full h-full object-cover transition-all duration-700 scale-100`}
                />
              ) : arcticLoading ? (
                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : null}
              
              {!arcticData.hasNFT && !arcticLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="text-center p-6">
                    <Lock size={40} className="mx-auto mb-4 text-white/40" />
                    <p className="text-sm font-medium text-white/60">Hold NFT to Unlock Card</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Ownership</span>
                {arcticData.hasNFT ? (
                  <span className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                    <CheckCircle2 size={16} /> Verified
                  </span>
                ) : (
                  <span className="text-white/20 text-sm font-bold">Not Found</span>
                )}
              </div>
              
              <h2 className="text-2xl font-medium tracking-tight">
                {arcticData.nftDetails?.name || 'Arctic Penguin'}
              </h2>
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>Holder Rewards Active</span>
              </div>

              <div className="pt-8 border-t border-white/5">
                <button 
                  onClick={() => { playClick(); window.open('https://movement.tradeport.xyz', '_blank'); }}
                  className="w-full py-4 rounded-xl glass border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 text-sm font-medium group"
                >
                  View on Marketplace <ExternalLink size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Referral Card */}
          {arcticData.hasNFT && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="glass rounded-[32px] p-8"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold tracking-widest text-white/50 uppercase">Referrals</span>
                <div className="text-right">
                  <span className="text-3xl font-medium block">{totalReferrals}</span>
                  <span className="text-[10px] text-white/30 font-bold tracking-widest uppercase">+{totalReferrals * 100} PTS TOTAL</span>
                </div>
              </div>
              <p className="text-white/40 text-sm mb-6">
                Friends you've invited who verified an NFT.
                <span className="block mt-1 text-emerald-400 font-bold text-[10px] tracking-wider uppercase">+100 PTS PER VERIFIED REF</span>
              </p>

              <button
                onClick={() => { playClick(); handleCopy(); }}
                className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                {copied ? (
                  <><CheckCircle2 size={16} className="text-emerald-400" /> Copied!</>
                ) : (
                  <><Copy size={16} /> Copy Invite Link</>
                )}
              </button>
            </motion.div>
          )}
        </div>

        {/* Missions List (Second on mobile) */}
        <div className="order-2 lg:order-1 lg:col-span-2 space-y-6">
          {quests.map((quest) => (
            <QuestCard key={quest.id} {...quest} />
          ))}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="p-12 border-2 border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center text-center group hover:border-white/10 transition-all"
          >
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Lock size={24} className="text-white/20" />
            </div>
            <p className="text-white/20 text-sm font-medium">New missions appearing soon...</p>
          </motion.div>
        </div>
      </div>

      <LevelUpOverlay 
        isVisible={showLevelUp} 
        onClose={() => setShowLevelUp(false)} 
        level={currentLevel}
        nftImage={completedQuestCount === 1 ? arcticData.nftDetails?.image : undefined}
        questName={lastLevelUpInfo?.name}
        rewardPoints={lastLevelUpInfo?.points}
      />
    </motion.div>
  );
};
