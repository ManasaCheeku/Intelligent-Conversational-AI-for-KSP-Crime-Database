import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/loading.json";

interface TypingIndicatorProps {
  text?: string;
  className?: string;
}

export default function TypingIndicator({
  text = "AI is analyzing crime intelligence...",
  className = "",
}: TypingIndicatorProps) {
  return (
    <div
      className={`flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4 ${className}`}
    >
      <div className="w-14 h-14">
        <Lottie
          animationData={loadingAnimation}
          loop
          autoplay
        />
      </div>

      <div className="flex-1">
        <p className="text-white font-medium">{text}</p>

        <div className="flex gap-1 mt-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
          <span
            className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
            style={{ animationDelay: "0.15s" }}
          ></span>
          <span
            className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></span>
        </div>
      </div>
    </div>
  );
}