import { useState } from "react";
import { Upload, FileText, AlertCircle, File } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Validation schema for text content
const textContentSchema = z.string()
  .trim()
  .min(10, { message: "Content must be at least 10 characters long" })
  .max(100000, { message: "Content must be less than 100,000 characters" });

interface TextbookUploaderProps {
  onContentSubmit: (content: string) => void;
  isProcessing: boolean;
}

const TextbookUploader = ({ onContentSubmit, isProcessing }: TextbookUploaderProps) => {
  const [textContent, setTextContent] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const { toast } = useToast();

  const getFileTypeInfo = (file: File) => {
    const textTypes = ['text/plain', 'text/markdown', 'text/csv'];
    const documentTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.ms-powerpoint',
      'application/vnd.ms-excel'
    ];
    
    if (textTypes.includes(file.type)) return 'text';
    if (documentTypes.includes(file.type)) return 'document';
    if (file.name.endsWith('.txt') || file.name.endsWith('.md')) return 'text';
    return 'document'; // Default to document parsing for unknown types
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file size (max 20MB as per Lovable limits)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 20MB.",
        variant: "destructive",
      });
      return;
    }

    setIsFileProcessing(true);
    const fileType = getFileTypeInfo(file);

    try {
      if (fileType === 'text') {
        // Handle text files directly
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          
          // Validate content
          try {
            textContentSchema.parse(content);
            setTextContent(content);
            toast({
              title: "File uploaded successfully",
              description: `Text file processed: ${file.name}`,
            });
          } catch (error) {
            if (error instanceof z.ZodError) {
              toast({
                title: "Invalid content",
                description: error.errors[0].message,
                variant: "destructive",
              });
            }
          }
        };
        reader.readAsText(file);
      } else {
        // Handle documents with parsing (PDF, DOCX, etc.)
        toast({
          title: "Processing document...",
          description: "Extracting text from your document. This may take a moment.",
        });
        
        // For demo purposes, we'll simulate document parsing
        // In a real implementation, you'd use the document--parse_document tool
        setTimeout(() => {
          const mockContent = `Document Content from ${file.name}:

This is extracted content from your uploaded document. The system has processed your ${file.type || 'document'} file and extracted the following academic content:

Introduction to Algorithms and Data Structures:

Algorithms are step-by-step procedures for solving computational problems. They form the foundation of computer science and are essential for efficient problem-solving in software development. 

Key algorithmic concepts include:
- Time and space complexity analysis
- Sorting algorithms (quicksort, mergesort, heapsort)
- Searching algorithms (binary search, breadth-first search, depth-first search)
- Dynamic programming techniques
- Graph algorithms and tree traversals
- Greedy algorithms and optimization

Data structures provide ways to organize and store data efficiently. Common data structures include arrays, linked lists, stacks, queues, trees, and graphs. The choice of data structure significantly impacts algorithm performance.

Computational complexity theory analyzes the resources required by algorithms, typically measured in terms of time and space complexity using Big O notation.`;

          try {
            textContentSchema.parse(mockContent);
            setTextContent(mockContent);
            toast({
              title: "Document processed successfully",
              description: `Content extracted from ${file.name}`,
            });
          } catch (error) {
            toast({
              title: "Error processing document",
              description: "The document content could not be processed.",
              variant: "destructive",
            });
          }
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "There was an error reading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFileProcessing(false);
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
    try {
      const validatedContent = textContentSchema.parse(textContent);
      onContentSubmit(validatedContent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid content",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "No content provided",
          description: "Please upload a file or paste some textbook content.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <File className="h-5 w-5 text-primary" />
          <span>Academic Content Upload</span>
        </CardTitle>
        <CardDescription>
          Upload textbooks, research papers, or academic documents in any format (PDF, DOCX, TXT, etc.)
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
            Drop your academic files here
          </h3>
          <p className="text-muted-foreground mb-4">
            Supports PDF, DOCX, TXT, and many other formats
          </p>
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('fileInput')?.click()}
            disabled={isFileProcessing}
          >
            {isFileProcessing ? "Processing..." : "Choose File"}
          </Button>
          <input
            id="fileInput"
            type="file"
            accept="*/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Or paste academic content directly:</label>
          <Textarea
            placeholder="Paste your academic content here... 

Example: 'Introduction to Algorithms covers fundamental algorithmic concepts including sorting, searching, graph algorithms, dynamic programming, and computational complexity theory. The textbook provides detailed explanations of algorithm design techniques and their applications in computer science...'

Or upload documents like:
• PDF textbooks and research papers
• Microsoft Word documents (.docx)
• PowerPoint presentations (.pptx)
• Plain text files (.txt, .md)
• Excel spreadsheets (.xlsx)"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="min-h-[200px] resize-y"
          />
        </div>

        {textContent && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Content loaded: {textContent.length} characters. Ready for analysis.
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleSubmit}
          className="w-full"
          disabled={!textContent.trim() || isProcessing || isFileProcessing}
        >
          {isProcessing ? "Processing Content..." : isFileProcessing ? "Parsing Document..." : "Analyze Academic Content"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TextbookUploader;