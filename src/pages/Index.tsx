
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Award, Users, Star, ArrowRight, Gift, Heart, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
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
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="mb-6">
            <Badge className="bg-amber-600/90 text-white px-4 py-2 text-lg mb-4">
              <Coffee className="mr-2 h-5 w-5" />
              Raw Smith Coffee
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Where Every Sip
            <span className="block bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              Earns Rewards
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
            Experience artisanal coffee crafted with passion. Join our loyalty program and 
            turn every visit into valuable rewards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg">
                  <Award className="mr-2 h-5 w-5" />
                  View Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Join Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
            
            <Link to="/rewards">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-amber-900 px-8 py-4 text-lg">
                <Gift className="mr-2 h-5 w-5" />
                Explore Rewards
              </Button>
            </Link>
          </div>

          {user && profile && (
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-200">Your Points</p>
                  <p className="text-2xl font-bold text-amber-300">{profile.current_points}</p>
                </div>
                <div>
                  <Badge className={`
                    ${profile.membership_tier === 'gold' ? 'bg-yellow-500' :
                      profile.membership_tier === 'silver' ? 'bg-gray-400' : 'bg-amber-600'}
                  `}>
                    {profile.membership_tier?.toUpperCase()} MEMBER
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">Why Choose Raw Smith?</h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">
              More than just coffee - we're building a community of coffee lovers with rewarding experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-amber-900">Artisanal Coffee</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-amber-700 text-base leading-relaxed">
                  Carefully sourced beans roasted to perfection. Each cup tells a story of craftsmanship and passion.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-amber-900">Loyalty Rewards</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-amber-700 text-base leading-relaxed">
                  Earn points with every purchase. Unlock exclusive rewards and climb through our membership tiers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-amber-900">Community</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-amber-700 text-base leading-relaxed">
                  Join a vibrant community of coffee enthusiasts. Participate in events and achieve collective goals.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-amber-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-amber-100">Coffees Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-amber-100">Reward Options</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-amber-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-amber-900 mb-6">
            Ready to Start Your Coffee Journey?
          </h2>
          <p className="text-xl text-amber-700 mb-8 max-w-2xl mx-auto">
            Join thousands of coffee lovers who are already earning rewards with every sip.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg">
                  <Heart className="mr-2 h-5 w-5" />
                  Join Our Community
                </Button>
              </Link>
              <Link to="/rewards">
                <Button variant="outline" size="lg" className="border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-4 text-lg">
                  <Star className="mr-2 h-5 w-5" />
                  View Rewards
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/dashboard">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg">
                <Coffee className="mr-2 h-5 w-5" />
                Continue Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
