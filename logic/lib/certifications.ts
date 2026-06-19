import pb from './pocketbase';
import type { Certification } from '../types/certifications';

// lekko bez sensu ze nie zrobiłem tego jak z krajami:
// trzeba było nie tworzyć tabeli, tylko poprostu trzasnąc plik w constants/
// mamy w bazie 5 różnych certyfikatów, ale juz nie zmieniałem takich rzeczy, tylko brnąłem dalej
// natomiast jak dodawałem kraje, to miałem chwilowy pomysł, żeby właśnie były na bazie i naszczęście się z tego wycofałem

const COLLECTION_CERTIFICATIONS = 'certifications';

export async function getAllCertifications(): Promise<Certification[]> {  
  const records = await pb.collection(COLLECTION_CERTIFICATIONS).getFullList();
  return records as unknown as Certification[];
}

// mamy relację w pocketbase 1-many na certyfikatach
// stąd możemy uzywać fields.certifications
export async function getUserCertificationIds(userId: string): Promise<string[]> {
  const user = await pb.collection('users').getOne(userId, {
    fields: 'certifications',
  });
  return user.certifications;
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
    throw new Error('Nie udało się zaktualizować certyfikatów');
  }
}