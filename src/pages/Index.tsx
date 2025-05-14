
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { CoffeeIcon, Award, Star, Users } from 'lucide-react';

const Index = () => {
  const { user, isAdmin } = useAuth();

  const redirectPath = user 
    ? isAdmin 
      ? '/admin/dashboard' 
      : '/dashboard'
    : '/auth';

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Hero Section */}
      <header className="bg-[#8B4513] text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Raw Smith Coffee Loyalty Program</h1>
              <p className="text-xl mb-8">Earn rewards for every cup. Join our loyalty program today!</p>
              <Button 
                asChild
                size="lg" 
                className="bg-[#FFD700] hover:bg-[#FFC700] text-[#8B4513] text-lg"
              >
                <Link to={redirectPath}>
                  {user ? 'Go to Dashboard' : 'Join Now'}
                </Link>
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <CoffeeIcon className="h-48 w-48" />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#8B4513] mb-12">Loyalty Program Benefits</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-[#8B4513]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B4513] mb-2 text-center">Earn Points</h3>
              <p className="text-center text-gray-600">
                Earn points with every purchase. The more you visit, the more you earn!
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-center mb-4">
                <Star className="h-12 w-12 text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B4513] mb-2 text-center">Exclusive Rewards</h3>
              <p className="text-center text-gray-600">
                Redeem your points for free drinks, pastries, and special merchandise.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-[#8B4513]" />
              </div>
              <h3 className="text-xl font-semibold text-[#8B4513] mb-2 text-center">Community Goals</h3>
              <p className="text-center text-gray-600">
                Join forces with other members to achieve community goals and earn bonus rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#F4EAD5] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#8B4513] mb-4">Ready to Start Earning?</h2>
          <p className="text-xl text-[#6F4E37] mb-8">
            Sign up now and get 10 welcome bonus points instantly!
          </p>
          <Button 
            asChild
            size="lg" 
            className="bg-[#8B4513] hover:bg-[#6F4E37] text-white text-lg"
          >
            <Link to={redirectPath}>
              {user ? 'Go to Dashboard' : 'Sign Up Now'}
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#8B4513] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <CoffeeIcon className="h-6 w-6 mr-2" />
                <span className="font-bold text-xl">Raw Smith Coffee</span>
              </div>
            </div>
            <div>
              <p className="text-sm">&copy; {new Date().getFullYear()} Raw Smith Coffee. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
