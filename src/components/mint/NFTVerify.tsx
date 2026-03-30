import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Loader2, CheckCircle2, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { useWallet } from '@razorlabs/razorkit';
import { useArcticPenguin } from '../../hooks/useArcticPenguin';
import { useReferral } from '../../hooks/useReferral';
import { creditReferral } from '../../services/referralService';
import { useSound } from '../../hooks/useSound';
import { LevelUpOverlay } from '../effects/LevelUpOverlay';
import { saveQuestStatus } from '../../services/questService';

interface NFTVerifyProps {
  leftImage: string;
  onVerified: () => void;
}

export const NFTVerify: React.FC<NFTVerifyProps> = ({ leftImage, onVerified }) => {
  const { address } = useWallet();
  const { playClick, playPointGained } = useSound();
  const { data, isLoading, error, refresh } = useArcticPenguin(address);
  const { getSavedReferrer, clearReferrer } = useReferral();
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');
  const [showLevelUp, setShowLevelUp] = useState(false);

  const handleVerify = () => {
    setVerifyStatus('verifying');
  };

  const processReferralIfValid = async () => {
    const referrer = getSavedReferrer();
    if (address && referrer && address !== referrer) {
      const success = await creditReferral(address, referrer);
      if (success) {
        clearReferrer();
      }
    }
  };

  // Wait for both the user click AND the hook to finish loading
  useEffect(() => {
    if (verifyStatus === 'verifying' && !isLoading) {
      const timer = setTimeout(() => {
        if (data.hasNFT) {
          setVerifyStatus('success');
          setShowLevelUp(true);
          playPointGained();
          processReferralIfValid();
          if (address) {
            saveQuestStatus(address, 'hold-nft', 'completed');
          }
        } else {
          setVerifyStatus('failed');
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [verifyStatus, isLoading, data.hasNFT]);

  useEffect(() => {
    if (verifyStatus === 'failed' && data.hasNFT) {
      setVerifyStatus('success');
      playPointGained();
      processReferralIfValid();
      if (address) {
        saveQuestStatus(address, 'hold-nft', 'completed');
      }
    }
  }, [data.hasNFT, verifyStatus]);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : 'Unknown Wallet';

  return (
    <motion.div
      key="verify"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Sliding NFT Image (Bottom Left) */}
      <motion.div
        initial={{ x: -250, y: 0, opacity: 0, rotate: 5 }}
        animate={{ x: -40, y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        className="absolute left-[-20px] bottom-0 block pointer-events-none z-20 md:z-0"
      >
        <img 
          src={leftImage} 
          alt="Illustration Left" 
          className="w-[220px] md:w-[500px] h-auto object-contain"
        />
      </motion.div>

      <div className="glass p-8 md:p-12 rounded-[32px] max-w-md w-full text-center relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-white relative">
            {verifyStatus === 'verifying' ? (
              <Loader2 className="animate-spin" size={40} />
            ) : verifyStatus === 'success' ? (
              <CheckCircle2 size={40} className="text-emerald-400" />
            ) : verifyStatus === 'failed' ? (
              <AlertCircle size={40} className="text-red-400" />
            ) : (
              <ShieldCheck size={40} />
            )}
            
            {verifyStatus === 'verifying' && (
              <motion.div 
                className="absolute inset-0 rounded-2xl border-2 border-white/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
        </div>

        <h2 className="text-3xl font-medium mb-3">
          {verifyStatus === 'success' ? 'NFT Verified!' : 
           verifyStatus === 'failed' ? 'NFT Not Found' : 'Verify Ownership'}
        </h2>
        
        <p className="text-white/40 mb-8 leading-relaxed">
          {verifyStatus === 'success' 
            ? 'We found your Arctic Penguin. Your access to the dashboard is now active.'
            : verifyStatus === 'failed'
            ? `We couldn't find an Arctic Penguin NFT in wallet ${shortAddress}. Please make sure you have minted it.`
            : `We need to check your wallet ${shortAddress} for the official Arctic Penguin Campaign Badge.`}
        </p>

        <div className="space-y-4">
          {verifyStatus === 'success' ? (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => { playClick(); onVerified(); }}
              className="rainbow-border w-full py-5 rounded-full text-white text-xl font-medium flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Enter Dashboard <ArrowRight size={24} />
            </motion.button>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { playClick(); handleVerify(); }}
                disabled={verifyStatus === 'verifying'}
                className="rainbow-border w-full py-5 rounded-full text-xl font-medium flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                {verifyStatus === 'verifying' ? 'Verifying...' : 'Verify NFT'}
              </button>
              
              {verifyStatus === 'failed' && (
                <button
                  onClick={() => { playClick(); refresh(); setVerifyStatus('idle'); }}
                  className="w-full py-4 rounded-full bg-white/5 hover:bg-white/10 text-white/40 text-sm font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCw size={16} /> Refresh Indexer
                </button>
              )}
            </div>
          )}
        </div>

        {verifyStatus === 'verifying' && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-xs text-white/60 font-mono tracking-widest uppercase animate-pulse"
          >
            Scanning Movement Blockchain...
          </motion.p>
        )}
      </div>

      <LevelUpOverlay 
        isVisible={showLevelUp} 
        onClose={() => setShowLevelUp(false)} 
        level={1}
        nftImage={leftImage}
        questName="NFT Verified"
        rewardPoints={100}
      />
    </motion.div>
  );
};
