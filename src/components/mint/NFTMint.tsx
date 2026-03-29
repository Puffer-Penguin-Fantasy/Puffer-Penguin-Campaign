import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

interface NFTMintProps {
  rightImage: string;
  minted: boolean;
  onMint: () => void;
  onContinue: () => void;
}

export const NFTMint: React.FC<NFTMintProps> = ({ 
  rightImage, 
  minted, 
  onMint, 
  onContinue 
}) => {
  const { playClick } = useSound();
  return (
    <motion.div
      key="mint"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Sliding NFT Image (Right) */}
      <motion.div
        initial={{ x: 250, y: 0, opacity: 0, rotate: 5 }}
        animate={{ x: 130, y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute right-0 bottom-0 block pointer-events-none z-20 md:z-0"
      >
        <img 
          src={rightImage} 
          alt="Illustration Right" 
          className="w-[220px] md:w-[500px] h-auto object-contain"
        />
      </motion.div>

      <div className="glass p-8 md:p-12 rounded-[20px] max-w-lg w-full text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-medium mb-4">Mint your NFT</h2>
        <p className="text-white/60 mb-10">Your journey begins here. Visit the marketplace to mint your exclusive Campaign Badge and unlock the dashboard.</p>
        
        <div className="flex flex-col gap-4">
          <a
            href="https://www.tradeport.xyz/movement/collection/0xf512c079941037aa3f8b6853d8f366ac1a70eaed7e2653ec9506e47ba199f861?tab=mint&bottomTab=trades"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { playClick(); onMint(); }}
            className="rainbow-border w-full py-5 rounded-full text-lg md:text-xl font-medium flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
          >
            <ExternalLink size={24} />
            Go to marketplace
          </a>

          <motion.button
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => { playClick(); onContinue(); }}
            className="w-full py-5 rounded-full text-lg md:text-xl font-medium flex items-center justify-center gap-3 bg-white text-black hover:bg-white/90 transition-colors"
          >
            Go to Verification <ArrowRight size={24} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
