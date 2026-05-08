'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, MessageSquare, Twitter } from 'lucide-react';

import logoImage from '../../assets/Zeus Penguin7.png';
import portfolioHeroImage from '../../assets/portfolioimage.png';
import heroPhoneImage from '../../assets/herophone.jpg';

interface PortfolioProps {
  onBack: () => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onBack }) => {


  return (
    <div className="relative min-h-screen w-full bg-[#52507f] text-white selection:bg-white/20 overflow-hidden">
      {/* Premium Background Elements - Matching Home */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Full-width Hero Image covering the top */}
        <div className="absolute top-0 left-0 w-full h-[85vh]">
          <img 
            src={portfolioHeroImage} 
            alt="Portfolio Hero" 
            className="hidden md:block w-full h-full object-cover"
          />
          <img 
            src={portfolioHeroImage} 
            alt="Portfolio Hero Mobile" 
            className="block md:hidden w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#52507f]" />
        </div>
      </div>

      {/* Navigation - Exact match from Home */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-8 md:px-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => { onBack(); }}
        >
          <img src={logoImage} alt="Puffer Logo" className="w-12 h-12 object-contain rounded-xl" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 sm:gap-4"
        >
          <a 
            href="https://discord.gg/kShG4pkg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 sm:w-11 sm:h-11 bg-black rounded-xl border border-white/10 flex items-center justify-center text-white hover:bg-zinc-900 transition-all shadow-lg" 
            aria-label="Discord"
          >
            <MessageSquare size={20} className="sm:w-6 sm:h-6" />
          </a>
          <a 
            href="https://x.com/arctic_pengu1n" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 sm:w-11 sm:h-11 bg-black rounded-xl border border-white/10 flex items-center justify-center text-white hover:bg-zinc-900 transition-all shadow-lg" 
            aria-label="X (Twitter)"
          >
            <Twitter size={18} className="sm:w-5 sm:h-5" />
          </a>
          <button 
            onClick={() => { onBack(); }}
            className="text-white/60 hover:text-white px-4 py-2.5 rounded-full text-[10px] sm:text-xs font-xirod tracking-[0.2em] transition-all ml-1 sm:ml-4 border border-white/5 whitespace-nowrap bg-white/5 hover:bg-white/10"
          >
            HOME
          </button>
          <button 
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-white px-4 py-2.5 rounded-full text-[10px] sm:text-xs font-xirod tracking-[0.2em] transition-all ml-1 sm:ml-4 border border-white/20 whitespace-nowrap bg-white/10 hover:bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            PORTFOLIO
          </button>
          <button 
            disabled
            className="bg-white/10 text-white/40 px-4 sm:px-8 py-2.5 rounded-full text-[10px] sm:text-sm font-roboto tracking-wide cursor-not-allowed ml-1 sm:ml-4 border border-white/5 whitespace-nowrap"
          >
            COMING SOON
          </button>
        </motion.div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-60 pb-32">
        <div className="max-w-3xl mx-auto text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 mx-auto lg:mx-0">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-[10px] font-roboto tracking-[0.2em] text-white/60 uppercase">Ecosystem Tool</span>
            </div>
            
            <h1 className="font-xirod text-4xl md:text-7xl tracking-[0.1em] text-white mb-8 leading-tight">
              VELO <br />
              <span className="text-white/40">PORTFOLIO</span>
            </h1>
            
            <p className="font-roboto text-white/60 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
              Velo is our premier portfolio management tool designed specifically for the Arctic Penguin ecosystem and the Movement network. 
              Track your assets, monitor your rewards, and waddle through the DeFi landscape with ease.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <a 
                href="https://velo-beta.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {}}
                className="inline-flex items-center justify-center gap-3 bg-white text-black px-10 py-5 rounded-full font-xirod text-sm tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                OPEN VELO <ExternalLink size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 mt-32 py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <img src={logoImage} alt="Arctic Penguin" className="w-8 h-8 object-contain rounded-lg" />
            <p className="text-white text-[10px] font-roboto tracking-widest">
              © 2026 Arctic Penguin. Powered by Velo.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
