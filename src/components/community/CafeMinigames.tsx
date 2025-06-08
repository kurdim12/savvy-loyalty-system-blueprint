
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coffee, Brain, Trophy, Users, Timer } from 'lucide-react';

export const CafeMinigames = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);

  const coffeeTrivia = [
    {
      question: "Which country is the largest producer of coffee beans?",
      answers: ["Colombia", "Brazil", "Ethiopia", "Vietnam"],
      correct: 1
    },
    {
      question: "What does 'espresso' mean in Italian?",
      answers: ["Strong", "Black", "Pressed out", "Hot"],
      correct: 2
    },
    {
      question: "Which coffee drink contains equal parts espresso and steamed milk?",
      answers: ["Cappuccino", "Latte", "Cortado", "Macchiato"],
      correct: 2
    }
  ];

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const startTrivia = () => {
    setSelectedGame('trivia');
    setGameActive(true);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setSelectedAnswer(null);
  };

  const answerQuestion = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === coffeeTrivia[currentQuestion].correct) {
      setScore(score + 10);
    }
    
    setTimeout(() => {
      if (currentQuestion < coffeeTrivia.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setGameActive(false);
      }
    }, 1500);
  };

  const collaborativeWordGame = () => {
    // Placeholder for collaborative word game
    setSelectedGame('words');
  };

  if (selectedGame === 'trivia') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-[#8B4513]">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Coffee Trivia
            </div>
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              {timeLeft}s
            </div>
          </CardTitle>
          <div className="flex items-center justify-between">
            <Badge className="bg-[#8B4513]/10 text-[#8B4513]">
              Question {currentQuestion + 1}/{coffeeTrivia.length}
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-800">
              <Trophy className="h-3 w-3 mr-1" />
              {score} points
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {gameActive ? (
            <>
              <div>
                <h3 className="font-medium text-[#8B4513] mb-3">
                  {coffeeTrivia[currentQuestion].question}
                </h3>
                <div className="space-y-2">
                  {coffeeTrivia[currentQuestion].answers.map((answer, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`w-full text-left justify-start ${
                        selectedAnswer === index
                          ? index === coffeeTrivia[currentQuestion].correct
                            ? 'bg-green-100 border-green-500 text-green-700'
                            : 'bg-red-100 border-red-500 text-red-700'
                          : selectedAnswer !== null && index === coffeeTrivia[currentQuestion].correct
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'hover:bg-[#8B4513]/10'
                      }`}
                      onClick={() => answerQuestion(index)}
                      disabled={selectedAnswer !== null}
                    >
                      {answer}
                    </Button>
                  ))}
                </div>
              </div>
              <Progress value={(timeLeft / 30) * 100} className="w-full" />
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold text-[#8B4513]">Game Over!</div>
              <div className="text-lg">Final Score: {score} points</div>
              <Button onClick={startTrivia} className="bg-[#8B4513] hover:bg-[#8B4513]/90">
                Play Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#8B4513]">
          <Coffee className="h-5 w-5" />
          Café Games
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <Button
          onClick={startTrivia}
          className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
        >
          <Brain className="h-4 w-4 mr-2" />
          Coffee Trivia Challenge
        </Button>
        
        <Button
          onClick={collaborativeWordGame}
          variant="outline"
          className="w-full border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10"
        >
          <Users className="h-4 w-4 mr-2" />
          Collaborative Word Game
        </Button>
        
        <div className="text-xs text-gray-500 text-center pt-2">
          Earn points and compete with other café visitors!
        </div>
      </CardContent>
    </Card>
  );
};
