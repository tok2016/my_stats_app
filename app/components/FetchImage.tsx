'use client';

import Image from 'next/image';
import { useState } from 'react';

import Skeleton from './Skeleton';

type FetchImageProps = {
  src: string;
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
  skeletonClassName?: string;
};

const IMAGE_DEFAULT_WIDTH = 150;

export default function FetchImage({
  src,
  width = IMAGE_DEFAULT_WIDTH,
  height = IMAGE_DEFAULT_WIDTH,
  className,
  imageClassName,
  skeletonClassName
}: FetchImageProps) {
  const [isPending, setPending] = useState<boolean>(true);

  return (
    <div className={`fetch-image ${className}`}>
      {!isPending || <Skeleton type='image' className={skeletonClassName} />}
      <Image
        src={src}
        width={width}
        height={height}
        className={`${imageClassName} ${isPending ? 'invisible' : ''}`}
        alt=''
        onLoad={() => setPending(false)}
      />
    </div>
  );
}
