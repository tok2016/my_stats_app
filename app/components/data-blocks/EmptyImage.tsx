import { Image as ImageIcon } from '@mynaui/icons-react';

type EmptyImageProps = {
  className?: string;
};

export default function EmptyImage({ className = '' }: EmptyImageProps) {
  return (
    <div className={`empty-cover ${className}`}>
      <ImageIcon />
    </div>
  );
}
