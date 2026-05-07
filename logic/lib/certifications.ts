import pb from './pocketbase';

const COLLECTION_CERTIFICATIONS = 'certifications';

export interface Certification {
  id: string;
  name: string;
}

export async function getAllCertifications(): Promise<Certification[]> {
  console.log('getAllCertifications START');
  console.log('pb.authStore.token:', pb.authStore.token ? 'EXISTS' : 'NULL');
  console.log('pb.authStore.isValid:', pb.authStore.isValid);
  
  try {
    const records = await pb.collection(COLLECTION_CERTIFICATIONS).getFullList({
    });
    
    console.log('getAllCertifications SUCCESS - count:', records.length);
    
    return records.map(r => ({
      id: r.id,
      name: r.name,
    }));
  } catch (error) {
    console.error('getAllCertifications ERROR:', error);
    return [];
  }
}

export async function getUserCertificationIds(userId: string): Promise<string[]> {
  try {
    const user = await pb.collection('users').getOne(userId, {
      fields: 'certifications',
    });
    
    return Array.isArray(user.certifications) ? user.certifications : [];
  } catch (error) {
    console.error('getUserCertificationIds error:', error);
    return [];
  }
}

export async function updateUserCertifications(
  userId: string, 
  certificationIds: string[]
): Promise<void> {
  try {
    await pb.collection('users').update(userId, {
      certifications: certificationIds,
    });
  } catch (error: any) {
    console.error('updateUserCertifications error:', error);
    throw new Error('Nie udało się zaktualizować certyfikatów');
  }
}