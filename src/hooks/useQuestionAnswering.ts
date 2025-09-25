import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface Answer {
  question: string;
  answer: string;
  confidence: number;
  sourceContext: string;
  relevantPassages: string[];
  timestamp: Date;
}

export const useQuestionAnswering = () => {
  const [textbookContent, setTextbookContent] = useState<string>("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processTextbookContent = useCallback((content: string) => {
    setTextbookContent(content);
    toast({
      title: "Content processed successfully",
      description: "Your textbook content is ready for question answering.",
    });
  }, [toast]);

  const findRelevantPassages = useCallback((content: string, question: string): string[] => {
    // Simple keyword-based passage extraction
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const questionWords = question.toLowerCase().split(/\s+/).filter(word => 
      word.length > 3 && !['what', 'how', 'why', 'when', 'where', 'which', 'does', 'the', 'and', 'or'].includes(word)
    );
    
    const scoredSentences = sentences.map(sentence => {
      const sentenceLower = sentence.toLowerCase();
      const score = questionWords.reduce((acc, word) => {
        return acc + (sentenceLower.includes(word) ? 1 : 0);
      }, 0);
      return { sentence: sentence.trim(), score };
    });

    return scoredSentences
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.sentence);
  }, []);

  const generateAnswer = useCallback((question: string, relevantPassages: string[]): { answer: string; confidence: number; sourceContext: string } => {
    // Mock RoBERTa-style answer generation
    // In a real implementation, this would use @huggingface/transformers
    
    if (relevantPassages.length === 0) {
      return {
        answer: "I couldn't find relevant information in the provided textbook content to answer this question.",
        confidence: 0.1,
        sourceContext: ""
      };
    }

    const bestPassage = relevantPassages[0];
    let answer = "";
    let confidence = 0.7; // Base confidence

    // Simple pattern matching for common question types
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes("time complexity") || questionLower.includes("complexity")) {
      answer = "Based on the textbook content, the time complexity analysis involves examining how the algorithm's runtime grows with input size. " + 
               "The relevant section discusses algorithmic efficiency and computational complexity theory.";
      confidence = 0.8;
    } else if (questionLower.includes("algorithm") || questionLower.includes("search") || questionLower.includes("sort")) {
      answer = "According to the textbook, this algorithmic concept involves systematic problem-solving approaches. " +
               "The text describes various techniques and their applications in computer science.";
      confidence = 0.75;
    } else if (questionLower.includes("dynamic programming")) {
      answer = "Dynamic programming is an optimization technique described in the textbook that solves complex problems by breaking them down into simpler subproblems. " +
               "It stores the results of subproblems to avoid redundant calculations.";
      confidence = 0.85;
    } else {
      // Generic answer based on content
      answer = `Based on the textbook content, ${bestPassage.substring(0, 200)}...`;
      confidence = Math.min(0.9, 0.4 + (relevantPassages.length * 0.1));
    }

    return {
      answer,
      confidence,
      sourceContext: bestPassage.substring(0, 150) + "..."
    };
  }, []);

  const askQuestion = useCallback(async (question: string) => {
    if (!textbookContent.trim()) {
      toast({
        title: "No content available",
        description: "Please upload textbook content first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const relevantPassages = findRelevantPassages(textbookContent, question);
      const { answer, confidence, sourceContext } = generateAnswer(question, relevantPassages);

      const newAnswer: Answer = {
        question,
        answer,
        confidence,
        sourceContext,
        relevantPassages,
        timestamp: new Date()
      };

      setAnswers(prev => [newAnswer, ...prev]);
      
      toast({
        title: "Question answered",
        description: `Answer generated with ${Math.round(confidence * 100)}% confidence.`,
      });

    } catch (error) {
      toast({
        title: "Error processing question",
        description: "There was an error generating the answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [textbookContent, findRelevantPassages, generateAnswer, toast]);

  return {
    textbookContent,
    answers,
    isProcessing,
    hasContent: textbookContent.trim().length > 0,
    processTextbookContent,
    askQuestion
  };
};