import { useState } from "react";
import { BrainCircuit } from "lucide-react";
import { policeService } from "../../services/policeService";
import type { ChatResponse } from "../../types/chatbot";

export function AIInvestigationAssistant({ crimeId }: { crimeId: number }) {
  const [language, setLanguage] = useState("English");
  const [analysis, setAnalysis] = useState<{ analysis: string; language: string; } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await policeService.ai(crimeId, language);
      setAnalysis(response);
    } catch {
      setError("AI analysis is unavailable. Configure GEMINI_API_KEY on the server and retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="detail-card ai-panel">
      <h2>
        <BrainCircuit size={20} /> AI investigation assistant
      </h2>
      <div className="button-row">
        <select value={language} onChange={(event) => setLanguage(event.target.value)}>
          <option>English</option>
          <option>Kannada</option>
        </select>
        <button className="primary-button" onClick={() => void generate()} disabled={loading}>
          {loading ? "Analysing…" : "Generate investigation summary"}
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
      {analysis && <pre className="ai-response">{analysis.analysis}</pre>}
    </section>
  );
}
