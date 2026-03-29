import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

interface LevelUpOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  level?: number;
  nftImage?: string;
  questName?: string;
  rewardPoints?: number;
}

export const LevelUpOverlay: React.FC<LevelUpOverlayProps> = ({ 
  isVisible, onClose, level = 1, nftImage, questName, rewardPoints 
}) => {
  const { playPointGained } = useSound();

  useEffect(() => {
    if (isVisible) {
      playPointGained();
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, playPointGained]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          {/* Animated Background Dim/Glow */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Rainbow Flare Background */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3], rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full blur-[60px] md:blur-[100px]"
            style={{
              background: 'conic-gradient(from 0deg, #4285f4, #bb55a1, #ea4335, #fbbc04, #b9d84c, #38a852, #4285f4)'
            }}
          />

          {/* Golden Glow Core */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="relative z-10 text-center px-4"
          >
            {/* Level Icon Container */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 md:mb-8 relative"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-2xl md:rounded-3xl rainbow-border flex items-center justify-center p-1">
                <div className="w-full h-full bg-black rounded-[18px] md:rounded-[22px] flex items-center justify-center text-white overflow-hidden">
                  {nftImage ? (
                    <img src={nftImage} alt="NFT Reward" className="w-full h-full object-cover" />
                  ) : (
                    <Trophy className="w-12 h-12 md:w-[60px] md:h-[60px] text-google-yellow" />
                  )}
                </div>
              </div>
              
              {/* Floating Stars */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{ 
                    x: (Math.random() - 0.5) * (window.innerWidth < 768 ? 150 : 300), 
                    y: (Math.random() - 0.5) * (window.innerWidth < 768 ? 150 : 300), 
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="absolute left-1/2 top-1/2 text-google-yellow"
                >
                  <Star className="w-4 h-4 md:w-6 md:h-6" fill="currentColor" />
                </motion.div>
              ))}
            </motion.div>

            {/* Main Text */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter italic mb-2">
                <span className="rainbow-text px-4">Level {level > 1 ? level : 'Up'}!</span>
              </h2>
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-google-lime" />
                <p className="text-sm sm:text-xl md:text-3xl font-bold tracking-widest text-white/80">
                  {questName || 'New Rank unlocked'}
                </p>
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-google-lime" />
              </div>
            </motion.div>

            {rewardPoints && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 md:mt-12 glass px-6 md:px-10 py-3 md:py-4 rounded-full inline-flex items-center gap-3 md:gap-4 text-google-lime font-bold text-sm md:text-xl border-google-lime/30"
              >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-google-lime/20 flex items-center justify-center">
                  <Trophy className="w-3 h-3 md:w-4 md:h-4" />
                </div>
                <span className="tracking-wider">+{rewardPoints.toLocaleString()} PTS GRANTED</span>
              </motion.div>
            )}
          </motion.div>

          {/* Interactive Screen Flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white z-[110] mix-blend-overlay"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
