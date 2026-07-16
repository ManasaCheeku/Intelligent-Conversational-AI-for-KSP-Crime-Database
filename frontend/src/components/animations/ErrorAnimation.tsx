import React, { memo } from 'react';
import Lottie, { LottieComponentProps } from 'lottie-react';
import errorAnimation from '../../assets/animations/error.json';

export interface ErrorAnimationProps {
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  speed?: number;
  style?: React.CSSProperties;
  lottieRef?: LottieComponentProps['lottieRef'];
  onComplete?: () => void;
}

export const ErrorAnimation: React.FC<ErrorAnimationProps> = memo(({
  width = 120,
  height = 120,
  loop = false,
  autoplay = true,
  className = '',
  speed = 1,
  style,
  lottieRef,
  onComplete,
}) => {
  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...style,
  };

  return (
    <div
      className={`flex items-center justify-center dark:bg-transparent ${className}`}
      style={containerStyle}
      aria-label="Error"
      role="alert"
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={errorAnimation}
        loop={loop}
        autoplay={autoplay}
        onComplete={onComplete}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
});

ErrorAnimation.displayName = 'ErrorAnimation';

export default ErrorAnimation;