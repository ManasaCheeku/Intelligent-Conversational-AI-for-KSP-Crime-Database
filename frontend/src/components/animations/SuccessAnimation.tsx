import React, { memo } from 'react';
import Lottie, { LottieComponentProps } from 'lottie-react';
import successAnimation from '../../assets/animations/success.json';

export interface SuccessAnimationProps {
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

export const SuccessAnimation: React.FC<SuccessAnimationProps> = memo(({
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
      aria-label="Success"
      role="img"
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={successAnimation}
        loop={loop}
        autoplay={autoplay}
        onComplete={onComplete}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
});

SuccessAnimation.displayName = 'SuccessAnimation';

export default SuccessAnimation;