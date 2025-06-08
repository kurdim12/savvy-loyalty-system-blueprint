
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, BookOpen, Trophy, Sparkles } from 'lucide-react';

interface CoffeeKnowledge {
  id: string;
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
}

interface AIBaristaProps {
  onOrderCoffee?: () => void;
  onLearnMore?: (topic: string) => void;
}

export const AIBarista = ({ onOrderCoffee, onLearnMore }: AIBaristaProps) => {
  const [currentTopic, setCurrentTopic] = useState<CoffeeKnowledge | null>(null);
  const [showTrivia, setShowTrivia] = useState(false);
  const [triviaQuestion, setTriviaQuestion] = useState<any>(null);

  const coffeeKnowledge: CoffeeKnowledge[] = [
    {
      id: '1',
      title: 'Ethiopian Coffee Origins',
      content: 'Ethiopia is considered the birthplace of coffee. The legend tells of a goat herder named Kaldi who discovered coffee when his goats became energetic after eating certain berries.',
      difficulty: 'beginner',
      completed: false
    },
    {
      id: '2',
      title: 'Coffee Processing Methods',
      content: 'There are three main processing methods: washed (wet), natural (dry), and honey. Each method dramatically affects the final flavor profile of the coffee.',
      difficulty: 'intermediate',
      completed: false
    },
    {
      id: '3',
      title: 'Advanced Brewing Techniques',
      content: 'Pour-over brewing requires precise water temperature (195-205°F), proper grind size, and controlled pouring technique to extract optimal flavors.',
      difficulty: 'advanced',
      completed: false
    }
  ];

  const triviaQuestions = [
    {
      question: "What country is considered the birthplace of coffee?",
      options: ["Brazil", "Ethiopia", "Colombia", "Jamaica"],
      correct: 1,
      explanation: "Ethiopia is widely considered the birthplace of coffee, with legends dating back over 1,000 years."
    },
    {
      question: "What temperature should water be for brewing coffee?",
      options: ["185-195°F", "195-205°F", "205-215°F", "175-185°F"],
      correct: 1,
      explanation: "The optimal brewing temperature is 195-205°F to properly extract coffee oils without burning."
    }
  ];

  const startTrivia = () => {
    const randomQuestion = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
    setTriviaQuestion(randomQuestion);
    setShowTrivia(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Barista Header */}
      <Card className="bg-gradient-to-r from-[#8B4513]/10 to-[#D2B48C]/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#8B4513]">
            <Coffee className="h-6 w-6" />
            Meet Alex - Your AI Barista
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8B4513] to-[#D2B48C] rounded-full flex items-center justify-center">
              <Coffee className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[#95A5A6] mb-3">
                "Welcome to Raw Smith! I'm here to help you discover amazing coffee and learn about our craft. What would you like to explore today?"
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={onOrderCoffee}
                  className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
                >
                  Order Coffee
                </Button>
                <Button
                  onClick={startTrivia}
                  variant="outline"
                  className="border-[#8B4513] text-[#8B4513]"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Coffee Trivia
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coffee Knowledge Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#8B4513]">
            <BookOpen className="h-5 w-5" />
            Coffee Education
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {coffeeKnowledge.map((topic) => (
              <div
                key={topic.id}
                className="p-3 border border-[#8B4513]/20 rounded-lg cursor-pointer hover:bg-[#8B4513]/5 transition-colors"
                onClick={() => setCurrentTopic(topic)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-[#8B4513]">{topic.title}</h4>
                  <Badge className={getDifficultyColor(topic.difficulty)}>
                    {topic.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-[#95A5A6] line-clamp-2">
                  {topic.content}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expanded Topic View */}
      {currentTopic && (
        <Card className="border-[#8B4513]/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#8B4513]">
              <Sparkles className="h-5 w-5" />
              {currentTopic.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#95A5A6] mb-4">{currentTopic.content}</p>
            <div className="flex gap-2">
              <Button
                onClick={() => onLearnMore?.(currentTopic.title)}
                className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
              >
                Learn More
              </Button>
              <Button
                onClick={() => setCurrentTopic(null)}
                variant="outline"
                className="border-[#8B4513] text-[#8B4513]"
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trivia Modal */}
      {showTrivia && triviaQuestion && (
        <Card className="border-2 border-[#8B4513]/50 bg-gradient-to-br from-[#8B4513]/5 to-[#D2B48C]/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#8B4513]">
              <Trophy className="h-5 w-5" />
              Coffee Trivia Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium text-[#8B4513] mb-4">{triviaQuestion.question}</h3>
            <div className="grid gap-2 mb-4">
              {triviaQuestion.options.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left justify-start border-[#8B4513]/20 hover:bg-[#8B4513]/10"
                  onClick={() => {
                    // Handle answer selection
                    console.log('Answer selected:', index);
                  }}
                >
                  {option}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => setShowTrivia(false)}
              variant="outline"
              className="border-[#8B4513] text-[#8B4513]"
            >
              Close Trivia
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
