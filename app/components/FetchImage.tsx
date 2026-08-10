'use client';

import { useState } from 'react';

import Image from 'next/image';

import Skeleton from './Skeleton';

type FetchImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
  skeletonClassName?: string;
  priority?: boolean;
};

const IMAGE_DEFAULT_WIDTH = 150;

export default function FetchImage({
  src,
  alt,
  width = IMAGE_DEFAULT_WIDTH,
  height = IMAGE_DEFAULT_WIDTH,
  className,
  imageClassName,
  skeletonClassName,
  priority
}: FetchImageProps) {
  const [isPending, setPending] = useState<boolean>(true);

  return (
    <div className={`fetch-image ${className}`}>
      {!isPending || <Skeleton type='image' className={skeletonClassName} />}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${imageClassName} ${isPending ? 'invisible' : ''}`}
        priority={priority}
        onLoad={() => setPending(false)}
      />
    </div>
  );
}
