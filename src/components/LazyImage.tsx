import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

type LazyImageProps = React.ComponentProps<'img'> & {
  containerClassName?: string;
};

export default function LazyImage({ src, alt, className, containerClassName, ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-primary/5", containerClassName)}>
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-primary/10" />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "transition-opacity duration-500 ease-in-out",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
    </div>
  );
}
