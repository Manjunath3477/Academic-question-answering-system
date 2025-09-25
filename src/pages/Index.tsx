import AcademicHeader from "@/components/AcademicHeader";
import TextbookUploader from "@/components/TextbookUploader";
import QuestionInterface from "@/components/QuestionInterface";
import AnswerDisplay from "@/components/AnswerDisplay";
import { useQuestionAnswering } from "@/hooks/useQuestionAnswering";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const {
    answers,
    isProcessing,
    hasContent,
    processTextbookContent,
    askQuestion
  } = useQuestionAnswering();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <AcademicHeader />
      
      <main className="container mx-auto px-6 py-12 space-y-12">
        {/* Content Upload Section */}
        <section>
          <TextbookUploader 
            onContentSubmit={processTextbookContent}
            isProcessing={isProcessing}
          />
        </section>

        <Separator className="my-8" />

        {/* Question Interface Section */}
        <section>
          <QuestionInterface
            onQuestionSubmit={askQuestion}
            isProcessing={isProcessing}
            hasContent={hasContent}
          />
        </section>

        {/* Results Section */}
        {answers.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <AnswerDisplay answers={answers} />
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
