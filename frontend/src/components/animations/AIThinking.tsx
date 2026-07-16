import React, { memo } from 'react';
import Lottie, { LottieComponentProps } from 'lottie-react';
import loadingAnimation from '../../assets/animations/loading.json';

export interface AIThinkingProps {
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  speed?: number;
  label?: string;
  style?: React.CSSProperties;
  lottieRef?: LottieComponentProps['lottieRef'];
}

export const AIThinking: React.FC<AIThinkingProps> = memo(({
  width = 140,
  height = 140,
  loop = true,
  autoplay = true,
  className = '',
  speed = 1,
  label = 'AI is analyzing...',
  style,
  lottieRef,
}) => {
  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...style,
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-xl dark:bg-transparent ${className}`}
      aria-label={label}
      role="status"
    >
      <div style={containerStyle} className="flex items-center justify-center">
        <Lottie
          lottieRef={lottieRef}
          animationData={loadingAnimation}
          loop={loop}
          autoplay={autoplay}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      {label && (
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300 animate-pulse tracking-wide">
          {label}
        </p>
      )}
    </div>
  );
});

AIThinking.displayName = 'AIThinking';

export default AIThinking;