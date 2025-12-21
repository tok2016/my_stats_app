import ProfileInfo from '@app/(user)/components/profile-info/ProfileInfo';
import { getOtherUser } from '@lib/actions';

export default async function UserPage({
  params
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getOtherUser(userId);

  return <ProfileInfo user={user} />;
}
