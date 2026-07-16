import React, { memo } from 'react';
import Lottie, { LottieComponentProps } from 'lottie-react';
import policeLoaderAnimation from '../../assets/animations/police-loader.json';

export interface PoliceLoaderProps {
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  speed?: number;
  style?: React.CSSProperties;
  lottieRef?: LottieComponentProps['lottieRef'];
}

export const PoliceLoader: React.FC<PoliceLoaderProps> = memo(({
  width = 120,
  height = 120,
  loop = true,
  autoplay = true,
  className = '',
  speed = 1,
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
      className={`flex items-center justify-center dark:bg-transparent ${className}`}
      style={containerStyle}
      aria-label="Processing..."
      role="status"
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={policeLoaderAnimation}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
});

PoliceLoader.displayName = 'PoliceLoader';

export default PoliceLoader;