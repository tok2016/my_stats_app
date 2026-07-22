import { UserSquareSolid } from '@mynaui/icons-react';

import FetchImage from '@components/FetchImage';
import Skeleton from '@components/Skeleton';

type AvatarProps = {
  username: string;
  avatarId?: string | null;
  loading?: boolean;
  className?: string;
};

const AVATAR_WIDTH = 150;

const getAvatarUrl = (avatarId: string) => {
  try {
    const avatarUrl = new URL(avatarId);
    return avatarUrl.toString();
  } catch {
    return `/api/avatar/${avatarId}`;
  }
};

export default function Avatar({
  username,
  avatarId,
  loading,
  className
}: AvatarProps) {
  if (loading) {
    return <Skeleton type='image' className={`avatar ${className}`} />;
  } else if (!avatarId) {
    return <UserSquareSolid className={`avatar stub ${className}`} />;
  }

  return (
    <FetchImage
      className={`avatar ${className}`}
      alt={`Avatar of ${username}`}
      src={getAvatarUrl(avatarId)}
      width={AVATAR_WIDTH}
      height={AVATAR_WIDTH}
      priority
    />
  );
}
