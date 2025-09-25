import { useState } from "react";
import { Send, HelpCircle, BookOpenCheck, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface QuestionInterfaceProps {
  onQuestionSubmit: (question: string) => void;
  isProcessing: boolean;
  hasContent: boolean;
}

const QuestionInterface = ({ onQuestionSubmit, isProcessing, hasContent }: QuestionInterfaceProps) => {
  const [question, setQuestion] = useState("");

  const suggestedQuestions = [
    "What is the time complexity of quicksort?",
    "Explain the difference between breadth-first and depth-first search",
    "How does dynamic programming solve optimization problems?",
    "What are the key principles of divide and conquer algorithms?",
    "Describe the concept of computational complexity theory"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && hasContent) {
      onQuestionSubmit(question.trim());
      setQuestion("");
    }
  };

  const handleSuggestedQuestion = (suggestedQ: string) => {
    setQuestion(suggestedQ);
  };

  return (
    <Card className={`shadow-card transition-all duration-300 ${
      hasContent ? "opacity-100" : "opacity-60"
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <span>Ask Your Question</span>
        </CardTitle>
        <CardDescription>
          {hasContent 
            ? "Ask questions about your uploaded textbook content" 
            : "Upload textbook content first to enable questioning"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            placeholder="Ask a question about the textbook content..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={!hasContent || isProcessing}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!question.trim() || !hasContent || isProcessing}
            size="icon"
          >
            {isProcessing ? (
              <Clock className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>

        {hasContent && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <BookOpenCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Suggested Questions:
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors"
                  onClick={() => handleSuggestedQuestion(q)}
                >
                  {q}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionInterface;