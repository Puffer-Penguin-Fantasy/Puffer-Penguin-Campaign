import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Check, X, ExternalLink, Loader2 } from 'lucide-react';
import { useWallet, ConnectModal } from '@razorlabs/razorkit';
import { useSound } from '../../hooks/useSound';

interface LandingProps {
  onWalletConnected: () => void;
  onViewPortfolio: () => void;
  onBack: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onWalletConnected, onViewPortfolio, onBack }) => {
  const { connected, account, address, status } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const { playClick } = useSound();

  // If connected, notify parent
  React.useEffect(() => {
    if (connected && account) {
      setShowModal(false);
      onWalletConnected();
    }
  }, [connected, account, onWalletConnected]);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Minimalist Header for Landing */}
      <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-end px-6 py-8 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { playClick(); onBack(); }}
            className="text-white/60 hover:text-white px-4 py-2 rounded-full text-[10px] font-xirod tracking-[0.2em] transition-all bg-white/5 hover:bg-white/10 border border-white/5"
          >
            HOME
          </button>
          <button 
            onClick={() => { playClick(); onViewPortfolio(); }}
            className="text-white/60 hover:text-white px-4 py-2 rounded-full text-[10px] font-xirod tracking-[0.2em] transition-all bg-white/5 hover:bg-white/10 border border-white/5"
          >
            PORTFOLIO
          </button>
        </div>
      </nav>
      <div className="relative z-20 text-center px-4 max-w-4xl">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-[40px] md:text-[80px] font-xirod leading-[1.1] tracking-tight mb-8"
        >
          Arctic <br />
          <span className="text-white opacity-90">Penguin</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-white/60 mb-12 max-w-xl mx-auto"
        >
          Column X Arctic Penguin
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center"
        >
          <button
            onClick={() => { playClick(); connected ? onWalletConnected() : setShowModal(true); }}
            className="rainbow-border px-10 py-5 rounded-full text-xl md:text-2xl font-medium flex items-center justify-center gap-4"
          >
            {connected ? (
              <>
                <Check size={28} />
                {shortAddress || 'Connected'}
              </>
            ) : (
              <>
                <Wallet size={28} />
                Connect wallet
              </>
            )}
          </button>
        </motion.div>
      </div>

      <ConnectModal 
        open={showModal} 
        onOpenChange={setShowModal}
      />
    </motion.div>
  );
};
