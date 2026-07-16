import React, { memo } from 'react';
import Lottie, { LottieComponentProps } from 'lottie-react';
import loadingAnimation from '../../assets/animations/loading.json';

export interface LoaderProps {
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  speed?: number;
  style?: React.CSSProperties;
  lottieRef?: LottieComponentProps['lottieRef'];
}

export const Loader: React.FC<LoaderProps> = memo(({
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
      aria-label="Loading"
      role="status"
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={loadingAnimation}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
});

Loader.displayName = 'Loader';

export default Loader;