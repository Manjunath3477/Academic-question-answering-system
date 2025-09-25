import { useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface TextbookUploaderProps {
  onContentSubmit: (content: string) => void;
  isProcessing: boolean;
}

const TextbookUploader = ({ onContentSubmit, isProcessing }: TextbookUploaderProps) => {
  const [textContent, setTextContent] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setTextContent(content);
        toast({
          title: "File uploaded successfully",
          description: "Your textbook content is ready for processing.",
        });
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a .txt file or paste text directly.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleSubmit = () => {
    if (textContent.trim()) {
      onContentSubmit(textContent.trim());
    } else {
      toast({
        title: "No content provided",
        description: "Please upload a file or paste some textbook content.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <span>Textbook Content Input</span>
        </CardTitle>
        <CardDescription>
          Upload your academic textbook content or paste text directly for analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            isDragOver 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            Drop your textbook file here
          </h3>
          <p className="text-muted-foreground mb-4">
            Supports .txt files or paste content below
          </p>
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            Choose File
          </Button>
          <input
            id="fileInput"
            type="file"
            accept=".txt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Or paste textbook content:</label>
          <Textarea
            placeholder="Paste your textbook content here... 

Example: 'Introduction to Algorithms covers fundamental algorithmic concepts including sorting, searching, graph algorithms, dynamic programming, and computational complexity theory. The textbook provides detailed explanations of algorithm design techniques...'"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="min-h-[200px] resize-y"
          />
        </div>

        {textContent && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Content loaded: {textContent.length} characters. Ready for processing.
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleSubmit}
          className="w-full"
          disabled={!textContent.trim() || isProcessing}
        >
          {isProcessing ? "Processing Content..." : "Process Textbook Content"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TextbookUploader;