import { BookOpen, Brain, Search } from "lucide-react";

const AcademicHeader = () => {
  return (
    <header className="relative bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8" />
            <BookOpen className="h-8 w-8" />
            <Search className="h-8 w-8" />
          </div>
        </div>
        
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Academic Question-Answering System
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Advanced NLP system powered by RoBERTa transformer model for intelligent 
            textbook analysis and question answering. Upload your academic content and 
            get precise answers with source citations.
          </p>
          
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-accent rounded-full"></div>
              <span>RoBERTa-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-accent rounded-full"></div>
              <span>Context-Aware</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-accent rounded-full"></div>
              <span>Source Citations</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50"></div>
    </header>
  );
};

export default AcademicHeader;