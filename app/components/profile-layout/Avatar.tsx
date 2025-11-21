import { UserSquareSolid } from '@mynaui/icons-react';

import FetchImage from '@components/FetchImage';
import Skeleton from '@components/Skeleton';

type AvatarProps = {
  avatarId?: string | null;
  loading?: boolean;
  className?: string;
};

const AVATAR_WIDTH = 150;

export default function Avatar({ avatarId, loading, className }: AvatarProps) {
  if (loading) {
    return <Skeleton type='image' className={`avatar ${className}`} />;
  } else if (!avatarId) {
    return <UserSquareSolid className={`avatar stub ${className}`} />;
  }

  return (
    <FetchImage
      className={`avatar ${className}`}
      src={`/api/avatar/${avatarId}`}
      width={AVATAR_WIDTH}
      height={AVATAR_WIDTH}
      priority
    />
  );
}
