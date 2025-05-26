
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Award, Users, Star, ArrowRight, Gift, Heart, Sparkles, Trophy, Camera, Share2 } from 'lucide-react';

const Index = () => {
  const { user, profile } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    '/lovable-uploads/e2fc2611-a942-411c-a3e2-676b7cf86455.png',
    '/lovable-uploads/5404e14c-b49d-4de3-b6c1-4d58b8ec620f.png',
    '/lovable-uploads/e14bae4b-002f-43c3-afc6-604e5d3976a7.png',
    '/lovable-uploads/b8f1af39-0790-44a9-aaad-8883e0af6666.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-concrete/10 via-white to-concrete/20">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Coffee shop interior ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <div className="mb-8">
            <Badge className="bg-black/80 backdrop-blur-sm text-white border-concrete px-6 py-3 text-lg mb-6 hover:bg-black/90 transition-all duration-300">
              <Coffee className="mr-3 h-6 w-6" />
              Raw Smith Coffee Experience
            </Badge>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            Where Every Sip
            <span className="block bg-gradient-to-r from-concrete to-white bg-clip-text text-transparent">
              Earns Rewards
            </span>
          </h1>
          
          <p className="text-xl md:text-3xl mb-12 text-gray-100 leading-relaxed max-w-4xl mx-auto">
            Experience artisanal coffee crafted with passion. Join our community and 
            turn every visit into valuable rewards and unforgettable moments.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button size="lg" className="bg-black hover:bg-concrete text-white px-10 py-6 text-xl transition-all duration-300 transform hover:scale-105">
                    <Award className="mr-3 h-6 w-6" />
                    View Dashboard
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
                <Link to="/community-hub">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-10 py-6 text-xl transition-all duration-300 transform hover:scale-105">
                    <Users className="mr-3 h-6 w-6" />
                    Community Hub
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" className="bg-black hover:bg-concrete text-white px-10 py-6 text-xl transition-all duration-300 transform hover:scale-105">
                    <Sparkles className="mr-3 h-6 w-6" />
                    Join Now
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
                <Link to="/rewards">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black px-10 py-6 text-xl transition-all duration-300 transform hover:scale-105">
                    <Gift className="mr-3 h-6 w-6" />
                    Explore Rewards
                  </Button>
                </Link>
              </>
            )}
          </div>

          {user && profile && (
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 max-w-lg mx-auto border border-concrete/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-200">Your Points</p>
                  <p className="text-3xl font-bold text-white">{profile.current_points}</p>
                </div>
                <div>
                  <Badge className={`
                    ${profile.membership_tier === 'gold' ? 'bg-yellow-500 text-black' :
                      profile.membership_tier === 'silver' ? 'bg-gray-300 text-black' : 
                      'bg-concrete text-black'}
                    px-4 py-2 text-sm font-bold
                  `}>
                    {profile.membership_tier?.toUpperCase()} MEMBER
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-black mb-6">Why Choose Raw Smith?</h2>
            <p className="text-2xl text-concrete max-w-3xl mx-auto">
              More than just coffee - we're building a community of coffee lovers with rewarding experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <Card className="border-2 border-concrete/20 shadow-2xl bg-white hover:shadow-3xl hover:border-black transition-all duration-500 transform hover:scale-105">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-black to-concrete rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Coffee className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-black">Artisanal Coffee</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-concrete text-lg leading-relaxed">
                  Carefully sourced beans roasted to perfection. Each cup tells a story of craftsmanship and passion.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-concrete/20 shadow-2xl bg-white hover:shadow-3xl hover:border-black transition-all duration-500 transform hover:scale-105">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-black to-concrete rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-black">Loyalty Rewards</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-concrete text-lg leading-relaxed">
                  Earn points with every purchase. Unlock exclusive rewards and climb through our membership tiers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-concrete/20 shadow-2xl bg-white hover:shadow-3xl hover:border-black transition-all duration-500 transform hover:scale-105">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-black to-concrete rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-black">Community Hub</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-concrete text-lg leading-relaxed">
                  Join challenges, photo contests, and social sharing. Connect with fellow coffee enthusiasts.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Community Preview Section */}
      <div className="bg-gradient-to-r from-black to-concrete py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join Our Coffee Community</h2>
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
            Participate in challenges, share your coffee moments, and compete with fellow enthusiasts
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300">
              <Trophy className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Weekly Challenges</h3>
              <p className="text-white/80">Complete coffee challenges and earn bonus points</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300">
              <Camera className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Photo Contests</h3>
              <p className="text-white/80">Share your perfect coffee moments and win prizes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300">
              <Share2 className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Referral Rewards</h3>
              <p className="text-white/80">Invite friends and climb the leaderboard</p>
            </div>
          </div>
          
          <Link to="/community-hub">
            <Button size="lg" className="mt-12 bg-white text-black hover:bg-white/90 px-10 py-6 text-xl transition-all duration-300 transform hover:scale-105">
              <Users className="mr-3 h-6 w-6" />
              Explore Community
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white border-2 border-concrete/20 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-5xl font-bold text-black mb-2">10K+</div>
              <div className="text-concrete text-lg">Happy Customers</div>
            </div>
            <div className="bg-white border-2 border-concrete/20 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-5xl font-bold text-black mb-2">50K+</div>
              <div className="text-concrete text-lg">Coffees Served</div>
            </div>
            <div className="bg-white border-2 border-concrete/20 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-5xl font-bold text-black mb-2">25+</div>
              <div className="text-concrete text-lg">Reward Options</div>
            </div>
            <div className="bg-white border-2 border-concrete/20 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-5xl font-bold text-black mb-2">99%</div>
              <div className="text-concrete text-lg">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-4 bg-gradient-to-b from-concrete/10 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-black mb-8">
            Ready to Start Your Coffee Journey?
          </h2>
          <p className="text-2xl text-concrete mb-12 max-w-3xl mx-auto">
            Join thousands of coffee lovers who are already earning rewards with every sip.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-black hover:bg-concrete text-white px-10 py-6 text-xl transition-all duration-300 transform hover:scale-105">
                  <Heart className="mr-3 h-6 w-6" />
                  Join Our Community
                </Button>
              </Link>
              <Link to="/rewards">
                <Button variant="outline" size="lg" className="border-black text-black hover:bg-black hover:text-white px-10 py-6 text-xl transition-all duration-300 transform hover:scale-105">
                  <Star className="mr-3 h-6 w-6" />
                  View Rewards
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/dashboard">
              <Button size="lg" className="bg-black hover:bg-concrete text-white px-10 py-6 text-xl transition-all duration-300 transform hover:scale-105">
                <Coffee className="mr-3 h-6 w-6" />
                Continue Your Journey
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
