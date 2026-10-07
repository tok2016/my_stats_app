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

/**
 * Checks if given avatarId is URL. If it's not, forms avatar's URL.
 * @param avatarId - Avatar id.
 * @returns Avatar URL.
 */
const getAvatarUrl = (avatarId: string) => {
  try {
    const avatarUrl = new URL(avatarId);
    return avatarUrl.toString();
  } catch {
    return `/api/avatar/${avatarId}`;
  }
};

/**
 * @param props
 * @param props.username
 * @param props.avatarId - User's avatar id.
 * @param props.loading - Is parent component loading. If true, renders skeleton.
 * @param props.className
 * @returns Image with user's avatar.
 */
export default function Avatar({
  username,
  avatarId,
  loading,
  className
}: AvatarProps) {
  if (loading) {
    return <Skeleton type='image' className={`avatar ${className}`} />;
  } else if (!avatarId) {
    return <UserSquareSolid className={`avatar ${className}`} />;
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
