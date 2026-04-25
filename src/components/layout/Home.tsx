'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Zap, Globe, Sparkles, Twitter, MessageSquare } from 'lucide-react';
import { useSound } from '../../hooks/useSound';
import logoImage from '../../assets/Zeus Penguin7.png';
import heroImage from '../../assets/hero.png';
import heroPhoneImage from '../../assets/herophone.jpg';
import { MotionCarousel } from '../ui/motion-carousel';
import { EmblaOptionsType } from 'embla-carousel';
import { useGlobalArcticPenguins } from '../../hooks/useArcticPenguin';

interface HomeProps {
  onStartCampaign: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStartCampaign }) => {
  const { playClick } = useSound();
  const { nfts, isLoading: nftsLoading } = useGlobalArcticPenguins(12);
  
  const carouselOptions: EmblaOptionsType = { loop: true };
  const slides = Array.from(Array(nfts.length || 0).keys());
  const nftImages = nfts.map(n => n.image);

  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-white/20 overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Full-width Hero Image covering the top */}
        <div className="absolute top-0 left-0 w-full h-[85vh]">
          {/* Desktop Hero */}
          <img 
            src={heroImage} 
            alt="Puffer Hero" 
            className="hidden md:block w-full h-full object-cover"
          />
          {/* Mobile Hero */}
          <img 
            src={heroPhoneImage} 
            alt="Puffer Hero Mobile" 
            className="block md:hidden w-full h-full object-cover"
          />
          {/* Subtle gradient to fade into black bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        </div>
      </div>

      {/* Navigation - Overlay on Hero */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-8 md:px-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <img src={logoImage} alt="Puffer Logo" className="w-12 h-12 object-contain" />
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
            <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.23 10.23 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a>
          <a 
            href="https://x.com/arctic_pengu1n" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 sm:w-11 sm:h-11 bg-black rounded-xl border border-white/10 flex items-center justify-center text-white hover:bg-zinc-900 transition-all shadow-lg" 
            aria-label="X (Twitter)"
          >
            <svg width="18" height="18" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <button 
            disabled
            className="bg-white/10 text-white/40 px-4 sm:px-8 py-2.5 rounded-full text-[10px] sm:text-sm font-roboto tracking-wide cursor-not-allowed ml-1 sm:ml-4 border border-white/5 whitespace-nowrap"
          >
            CAMPAGIN CLOSED
          </button>
        </motion.div>
      </nav>

      {/* Hero Section Content */}
      <main className="relative">
        {/* Empty space to allow hero image to show */}
        <div className="h-[60vh]" />
        
        {/* Arctic Penguin Carousel Section */}
        <div className="relative z-10 -mt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-xirod text-3xl md:text-5xl tracking-[0.2em] text-glow mb-4">ARCTIC PENGUIN</h2>
          </motion.div>
          
          <MotionCarousel 
            slides={slides} 
            options={carouselOptions} 
            images={nftImages} 
          />

          {/* Movement Network Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mt-20 px-6"
          >
            <h3 className="font-xirod text-xl md:text-2xl tracking-[0.15em] text-white/90 mb-4 uppercase">
              We are built on the <span className="text-white">Movement</span> network
            </h3>
            <p className="font-roboto text-white/40 tracking-[0.2em] text-sm md:text-base max-w-2xl mx-auto uppercase leading-relaxed">
              Waddling into the future with ultra-fast transactions, <br className="hidden md:block" />
              arctic-cool security, and zero friction.
            </p>
          </motion.div>

          <section className="mt-40 px-6 pb-40">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col justify-center"
              >
                <h2 className="font-xirod text-4xl md:text-6xl tracking-[0.1em] text-white mb-10 leading-none text-center lg:text-left">
                  PUFFER <br className="hidden lg:block" /> WALKS
                </h2>
                <div className="space-y-6 text-center lg:text-left">
                  <p className="font-roboto text-white/60 text-lg leading-relaxed">
                    Step into the future of fitness. Puffer Walks is our flagship Walk-to-Earn application where every waddle counts. 
                  </p>
                  <p className="font-roboto text-white/40 text-base leading-relaxed">
                    By connecting your fitness data to the Movement Network, we turn your physical activity into digital rewards. Compete with the colony, climb the leaderboard, and unlock exclusive Arctic Penguin benefits just by staying active.
                  </p>
                <div className="pt-8 flex justify-center lg:justify-start">
                    <a 
                      href="https://pufferwalks.arcticpenguin.xyz/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-xirod text-sm tracking-widest hover:scale-105 transition-transform"
                    >
                      EXPLORE APP <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="flex justify-center"
              >
                {/* Phone Mockup */}
                <div className="relative w-[320px] h-[650px] bg-zinc-900 rounded-[3rem] border-[8px] border-zinc-800 shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden">
                  {/* Camera Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-zinc-800 rounded-b-2xl z-20" />
                  
                  {/* Iframe content */}
                  <iframe 
                    src="https://pufferwalks.arcticpenguin.xyz/" 
                    className="w-full h-full border-none"
                    title="Puffer Walks App Preview"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* NFT Utility Section */}
          <section className="mt-40 px-6">
            <div className="max-w-7xl mx-auto text-center mb-20">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-xirod text-3xl md:text-5xl tracking-[0.1em] text-white mb-6"
              >
                HOLDER <span className="text-white/40">UTILITY</span>
              </motion.h2>
              <p className="font-roboto text-white/40 tracking-[0.2em] text-sm">
                Benefits of joining the Arctic Penguin ecosystem
              </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap size={32} className="text-white" />,
                  title: "APP ACCESS",
                  desc: "Your Arctic Penguin acts as the primary access key to the Puffer Walks platform, unlocking your ability to earn rewards."
                },
                {
                  icon: <Shield size={32} className="text-white" />,
                  title: "COLONY ACCESS",
                  desc: "Exclusive access to private Discord channels, community governance, and early-stage project updates."
                },
                {
                  icon: <Sparkles size={32} className="text-white" />,
                  title: "FUTURE DROPS",
                  desc: "Priority whitelisting for upcoming ecosystem collections and token distributions on the Movement network."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 rounded-[2.5rem] bg-zinc-900 border border-white/5 hover:border-white/20 transition-all group"
                >
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h4 className="font-xirod text-xl text-white mb-4 tracking-wider">{item.title}</h4>
                  <p className="font-roboto text-white/40 leading-relaxed text-sm tracking-wide">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Join the Colony Section */}
          <section className="mt-60 mb-20 px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto py-24 px-10 rounded-[3rem] bg-gradient-to-b from-zinc-900 to-black border border-white/5 text-center relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />
              
              <h2 className="font-xirod text-4xl md:text-6xl tracking-[0.1em] text-white mb-8 leading-tight relative z-10">
                JOIN THE <br /> <span className="text-white/40">COLONY</span>
              </h2>
              <p className="font-roboto text-white/40 text-lg md:text-xl mb-12 max-w-2xl mx-auto tracking-[0.15em] relative z-10">
                Waddle with us and become part of the fastest-growing community on Movement.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                <a 
                  href="https://discord.gg/kShG4pkg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-white text-black px-12 py-5 rounded-full font-xirod text-sm tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-3"
                >
                  DISCORD <MessageSquare size={18} />
                </a>
                <a 
                  href="https://x.com/arctic_pengu1n"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-black text-white border border-white/10 px-12 py-5 rounded-full font-xirod text-sm tracking-widest hover:bg-zinc-900 transition-all flex items-center justify-center gap-3"
                >
                  FOLLOW X <Twitter size={18} />
                </a>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 mt-32 py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <img src={logoImage} alt="Arctic Penguin" className="w-8 h-8 object-contain opacity-50" />
            <p className="text-white/20 text-[10px] font-roboto tracking-widest uppercase">
              © 2026 ARCTIC PENGUIN. ALL RIGHTS RESERVED.
            </p>
          </div>
          
          <div className="flex items-center gap-10">
            <a 
              href="https://pufferwalks.arcticpenguin.xyz/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/20 hover:text-white/60 transition-all text-[10px] font-roboto tracking-widest uppercase"
            >
              Privacy Policy
            </a>
            <a href="#" className="text-white/20 hover:text-white/60 transition-all text-[10px] font-roboto tracking-widest uppercase">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
