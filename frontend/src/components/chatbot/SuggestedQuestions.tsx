interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

const defaultQuestions = [
  "Show cyber fraud cases in Bengaluru",
  "Predict crime hotspots",
  "Find repeat offenders",
  "Generate FIR summary",
  "Show criminal network",
  "Analyze suspect behavior",
];

export default function SuggestedQuestions({
  questions = defaultQuestions,
  onSelect,
}: SuggestedQuestionsProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-white mb-4">
        Suggested Investigation Queries
      </h2>

      <div className="grid md:grid-cols-2 gap-3">
        {questions.map((question) => (
          <button
            key={question}
            onClick={() => onSelect(question)}
            className="text-left rounded-xl border border-slate-700 bg-slate-800 hover:bg-cyan-900 hover:border-cyan-500 transition p-4 text-white"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}