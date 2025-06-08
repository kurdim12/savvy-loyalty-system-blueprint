
import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useAuth } from '@/contexts/AuthContext';

interface CinematicLandingProps {
  onEnterCoffeeShop: () => void;
}

export const CinematicLanding = ({ onEnterCoffeeShop }: CinematicLandingProps) => {
  const { user, profile, loading } = useAuth();
  const [isEntering, setIsEntering] = useState(false);
  
  useEffect(() => {
    // Entrance fade-in animation
    gsap.fromTo('.cinematic-container', {
      opacity: 0,
      scale: 1.1
    }, {
      opacity: 1,
      scale: 1,
      duration: 2,
      ease: "power2.out"
    });
  }, []);

  const handleEnterCoffeeShop = async () => {
    if (isEntering) return;
    
    setIsEntering(true);
    
    // Cinematic entry animation with zoom effect
    gsap.timeline()
      .to('.exterior-shot', {
        scale: 1.3,
        duration: 1.5,
        ease: "power2.inOut"
      })
      .to('.cinematic-container', {
        opacity: 0,
        duration: 0.8,
        ease: "power2.in"
      })
      .call(() => {
        onEnterCoffeeShop();
      });
  };

  if (loading) {
    return (
      <div className="loading-cinematic">
        Loading your coffee experience...
      </div>
    );
  }

  const displayName = profile?.first_name || user?.email?.split('@')[0] || 'Coffee Lover';

  return (
    <div className="cinematic-container">
      {/* Photorealistic Exterior Background using uploaded image */}
      <div 
        className="exterior-shot"
        style={{
          backgroundImage: `url('/lovable-uploads/9e789f3f-a692-425c-b0fb-fdd4abbe5390.png')`
        }}
      >
        {/* Atmospheric Overlay */}
        <div className="atmospheric-overlay" />
        
        {/* Welcome Message */}
        <div className="loyalty-status-cinematic">
          <div className="member-welcome">
            <h2 className="welcome-text">Welcome back, {displayName}</h2>
          </div>
        </div>

        {/* Neon Community Sign */}
        <div className="neon-community-sign">
          VIRTUAL CAFÉ
        </div>

        {/* Entry Button */}
        <button 
          className="enter-coffee-shop-cinematic"
          onClick={handleEnterCoffeeShop}
          disabled={isEntering}
        >
          <span className="button-text">
            {isEntering ? 'Entering...' : 'Enter Coffee Shop'}
          </span>
          <div className="button-glow" />
        </button>

        {/* Coffee Steam Effects */}
        <div className="steam-effects">
          <div className="steam-particle" style={{left: '30%', animationDelay: '0s'}} />
          <div className="steam-particle" style={{left: '70%', animationDelay: '1s'}} />
          <div className="steam-particle" style={{left: '50%', animationDelay: '2s'}} />
        </div>
      </div>
    </div>
  );
};
