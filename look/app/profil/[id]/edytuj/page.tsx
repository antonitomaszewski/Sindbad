import { redirect, notFound } from 'next/navigation';
import { getServerUser } from '../../../../../logic/lib/users.server';
import { getUser } from '../../../../../logic/lib/users';
import { getAllCertifications, getUserCertificationIds } from '../../../../../logic/lib/certifications';
import EditProfileView from '../../../../components/profile/EditProfileView';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function EditProfilePage({ params }: Props) {
  const { id } = await params;
  const currentUser = await getServerUser();

  if (!currentUser) {
    redirect('/logowanie');
  }

  if (currentUser.id !== id) {
    notFound();
  }

  const [freshUser, availableCertifications, userCertIds] = await Promise.all([
    getUser(id),
    getAllCertifications(),
    getUserCertificationIds(id),
  ]);

  if (!freshUser) {
    notFound();
  }

  return (
    <EditProfileView 
      user={freshUser} 
      availableCertifications={availableCertifications}
      userCertificationIds={userCertIds}
    />
  );
}