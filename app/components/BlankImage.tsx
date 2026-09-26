import { Image as ImageIcon } from '@mynaui/icons-react';

type EmptyImageProps = {
  className?: string;
};

export default function BlankImage({ className = '' }: EmptyImageProps) {
  return (
    <div className={`blank-image ${className}`}>
      <ImageIcon />
    </div>
  );
}
