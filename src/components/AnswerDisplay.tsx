import { CheckCircle, Quote, BookOpen, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Answer {
  question: string;
  answer: string;
  confidence: number;
  sourceContext: string;
  relevantPassages: string[];
  timestamp: Date;
}

interface AnswerDisplayProps {
  answers: Answer[];
}

const AnswerDisplay = ({ answers }: AnswerDisplayProps) => {
  if (answers.length === 0) {
    return null;
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "High Confidence";
    if (confidence >= 0.6) return "Medium Confidence";
    return "Low Confidence";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center space-x-2">
        <CheckCircle className="h-6 w-6 text-green-600" />
        <span>Question & Answer Results</span>
      </h2>
      
      {answers.map((answer, index) => (
        <Card key={index} className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-start justify-between">
              <div className="flex items-start space-x-2 flex-1">
                <Quote className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-lg">{answer.question}</span>
              </div>
              <Badge 
                variant="outline" 
                className={`ml-4 ${getConfidenceColor(answer.confidence)}`}
              >
                {getConfidenceLabel(answer.confidence)}
              </Badge>
            </CardTitle>
            <CardDescription className="flex items-center justify-between">
              <span>Asked {answer.timestamp.toLocaleTimeString()}</span>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {Math.round(answer.confidence * 100)}% confidence
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Confidence Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Answer Confidence</span>
                <span>{Math.round(answer.confidence * 100)}%</span>
              </div>
              <Progress value={answer.confidence * 100} className="h-2" />
            </div>

            {/* Main Answer */}
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Answer:</h4>
              <div className="bg-gradient-to-r from-accent/5 to-primary/5 p-4 rounded-lg border-l-4 border-primary">
                <p className="leading-relaxed">{answer.answer}</p>
              </div>
            </div>

            {/* Source Context */}
            {answer.sourceContext && (
              <div className="space-y-2">
                <h4 className="font-semibold text-muted-foreground flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Source Context:</span>
                </h4>
                <div className="bg-muted/50 p-3 rounded-lg text-sm italic">
                  "{answer.sourceContext}"
                </div>
              </div>
            )}

            {/* Relevant Passages */}
            {answer.relevantPassages.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-muted-foreground">
                  Related Textbook Passages:
                </h4>
                <div className="space-y-2">
                  {answer.relevantPassages.map((passage, passageIndex) => (
                    <div 
                      key={passageIndex}
                      className="bg-secondary/30 p-3 rounded-lg text-sm border border-secondary"
                    >
                      {passage}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnswerDisplay;