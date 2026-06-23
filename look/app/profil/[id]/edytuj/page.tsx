// Strona edycji profilu.

'use client';

import { redirect } from 'next/navigation';
import { isCurrentServerUser } from '../../../../../logic/lib/users';
import type { Certification } from '@/logic/types/certification';
import { getAllCertifications, getUserCertificationIds } from '../../../../../logic/lib/certifications';
import EditProfileView from '../../../../components/profile/EditProfileView';
import { useUser } from '../../../../hooks/useUser';
import { use, useEffect, useState } from 'react';
import { LoadingState } from '../../../../components/common/LoadingState';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditProfilePage({ params }: Props) {
  const { id } = use(params);
  const { user, loading: userLoading} = useUser(id);

  const [availableCertifications, setAvailableCertifications] = useState<Certification[]>([]);
  const [userCertIds, setUserCertIds] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (userLoading || !user) return;

    if (!isCurrentServerUser(user)) {
      redirect('/logowanie');
    }

    Promise.all([
      getAllCertifications(),
      getUserCertificationIds(id),
    ]).then(([certs, certIds]) => {
      setAvailableCertifications(certs);
      setUserCertIds(certIds);
      setDataLoading(false);
    });
  }, [id, user, userLoading]);

  if (userLoading || dataLoading) {
    return <LoadingState message="Ładowanie ..." />;
  }

  return (
    <EditProfileView
      user={user}
      availableCertifications={availableCertifications}
      userCertificationIds={userCertIds}
    />
  );
}
