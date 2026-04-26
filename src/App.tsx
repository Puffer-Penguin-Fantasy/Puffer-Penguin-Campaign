import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAccount } from '@razorlabs/razorkit';
import { Analytics } from '@vercel/analytics/react';
import { Step } from './types';
import { Landing } from './components/layout/Landing';
import { NFTMint } from './components/mint/NFTMint';
import { NFTVerify } from './components/mint/NFTVerify';
import { Dashboard } from './components/dashboard/Dashboard';
import { Home } from './components/layout/Home';

import backgroundVideo from './assets/background.mp4';
import rightImage from './assets/rightimage.png';
import leftImage from './assets/leftimage.png';
import { useReferral } from './hooks/useReferral';

export default function App() {
  useReferral(); // Intercepts ?ref= link instantly on load and saves to localStorage
  
  const [step, setStep] = useState<Step>(() => {
    const saved = localStorage.getItem('arctic_penguin_step');
    return (saved as Step) || 'home';
  });
  const [minted, setMinted] = useState(() => {
    return localStorage.getItem('arctic_penguin_minted') === 'true';
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isConnected, isConnecting } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle global logout - redirect to landing (with a grace period for auto-connecters on refresh)
  useEffect(() => {
    if (mounted && step !== 'landing' && step !== 'home') {
      const gracePeriod = setTimeout(() => {
        if (!isConnecting && !isConnected) {
          setStep('home');
          localStorage.removeItem('arctic_penguin_step');
          localStorage.removeItem('arctic_penguin_minted');
        }
      }, 2500); // Increased grace period to 2.5s for slow auto-connections on Hard Refresh
      
      return () => clearTimeout(gracePeriod);
    }
  }, [mounted, isConnected, isConnecting, step]);

  // Persist state
  useEffect(() => {
    if (step) localStorage.setItem('arctic_penguin_step', step);
    localStorage.setItem('arctic_penguin_minted', String(minted));
  }, [step, minted]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Video autoplay failed:', error);
      });
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden">
      <Analytics />
      {/* Shared Video Background for Campaign steps */}
      {(step === 'landing' || step === 'mint' || step === 'verify') && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <video
            ref={videoRef}
            src={backgroundVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'home' && (
          <Home
            onStartCampaign={() => setStep('landing')}
          />
        )}

        {step === 'landing' && (
          <Landing
            onWalletConnected={() => setStep('mint')}
          />
        )}

        {step === 'mint' && (
          <NFTMint
            rightImage={rightImage}
            minted={minted}
            onMint={() => setMinted(true)}
            onContinue={() => setStep('verify')}
          />
        )}

        {step === 'verify' && (
          <NFTVerify
            leftImage={leftImage}
            onVerified={() => setStep('dashboard')}
          />
        )}

        {step === 'dashboard' && (
          <Dashboard />
        )}
      </AnimatePresence>

      {/* Footer Navigation (only on dashboard) */}
      {step === 'dashboard' && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 glass px-8 py-3 rounded-full flex items-center z-50"
        >
          <button className="text-white/60 font-medium text-xs md:text-sm">Dashboard</button>
        </motion.nav>
      )}
    </div>
  );
}
