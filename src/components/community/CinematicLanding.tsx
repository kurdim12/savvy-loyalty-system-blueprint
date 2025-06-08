
import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    if (isEntering || !user) return;
    
    setIsEntering(true);
    
    try {
      // Award visit points (preserve existing functionality)
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          points: 5,
          transaction_type: 'earn',
          notes: 'Coffee shop visit'
        });

      if (error) {
        console.error('Error awarding visit points:', error);
      } else {
        // Show cinematic points notification
        showCinematicPointsNotification(5, 'Coffee Shop Visit');
      }

      // Cinematic entry animation
      gsap.timeline()
        .to('.exterior-shot', {
          scale: 1.2,
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
    } catch (error) {
      console.error('Error entering coffee shop:', error);
      setIsEntering(false);
    }
  };

  const showCinematicPointsNotification = (points: number, activity: string) => {
    const notification = document.createElement('div');
    notification.className = 'points-notification-cinematic';
    notification.innerHTML = `
      <div class="points-earned">
        <span class="points-amount">+${points}</span>
        <span class="points-activity">${activity}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    gsap.fromTo(notification, {
      y: -50,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(1.7)"
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
      gsap.to(notification, {
        y: -50,
        opacity: 0,
        duration: 0.3,
        onComplete: () => notification.remove()
      });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="loading-cinematic">
        Loading your coffee experience...
      </div>
    );
  }

  const displayName = profile?.first_name || user?.email?.split('@')[0] || 'Coffee Lover';
  const tier = profile?.membership_tier || 'bronze';
  const points = profile?.current_points || 0;

  return (
    <div className="cinematic-container">
      {/* Photorealistic Exterior Background */}
      <div className="exterior-shot">
        {/* Atmospheric Overlay */}
        <div className="atmospheric-overlay" />
        
        {/* Loyalty Status Integration */}
        <div className="loyalty-status-cinematic">
          <div className="member-welcome">
            <h2 className="welcome-text">Welcome back, {displayName}</h2>
            <div className={`tier-badge-cinematic tier-${tier.toLowerCase()}`}>
              {tier.charAt(0).toUpperCase() + tier.slice(1)} Member
            </div>
            <div className="points-display-atmospheric">
              <span className="points-number">{points}</span>
              <span className="points-label">Points</span>
            </div>
          </div>
        </div>

        {/* Neon Community Sign */}
        <div className="neon-community-sign">
          COMMUNITY
        </div>

        {/* Entry Button with Point Preview */}
        <button 
          className="enter-coffee-shop-cinematic"
          onClick={handleEnterCoffeeShop}
          disabled={isEntering}
        >
          <span className="button-text">
            {isEntering ? 'Entering...' : 'Enter Coffee Shop'}
          </span>
          <span className="point-preview">+5 points for visit</span>
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
