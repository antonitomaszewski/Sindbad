// logika uploadu i pobierania obrazków
// dotyczy obrazków z profiu użytkownika, oraz oferty
import pb from './pocketbase';
import { OfferImage, CreateOfferImageData } from '../types/image';
import { IMAGE_CONFIG } from '../constants/image';
import { User } from '../types/user';

// uzywane w 2 miejscach
// 1. w kafelkach wyszukiwania oferty - wtedy będziemy korzystać tylko z "lidera"
// 2. w galerii na stronie oferty
// mam taką kolumnę "order", z której praktycznie ostatecznie nie korzystam, pomyślane było, by można ustawić kolejność obrazków na stronie oferty
// poprostu w kolejności w jakiej się wrzuci obrazki - tak będą się zawsze wyświetlać, ale uzytkownik o tym nie wie
export async function getOfferImages(offerId: string): Promise<OfferImage[]> {
  try {
    const images = await pb.collection('images').getFullList<OfferImage>({
      filter: `offer_id = "${offerId}"`,
      sort: '+order,+created'
    });
    return images;
  } catch (error) {
    console.error('Błąd pobierania zdjęć:', error);
    return [];
  }
}

// tworzenie pojedynczego obrazka, wywoływane w uploadOfferImages
export async function createOfferImage(data: CreateOfferImageData) {
  try {
        // 1. Walidacja rozmiaru , maks 5mb
    if (data.image.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
      throw new Error(`Plik jest za duży. Maksymalny rozmiar: ${IMAGE_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB. Twój plik: ${(data.image.size / 1024 / 1024).toFixed(1)}MB`);
    }

    // 2. Walidacja typu
    if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(data.image.type as any)) {
      throw new Error(`Nieprawidłowy format pliku. Dozwolone: JPG, PNG, WebP`);
    }

    await pb.collection('images').create<OfferImage>({
      'offer_id': data.offer_id,
      'image': data.image,
      'order': data.order,
    });
  } catch (error: any) {
    throw error;
  }
}


// przekazujemy tu do galerii link do obrazka: adres bazy + ścieżka do pliku
export function getImageUrl(image: OfferImage, options?: { thumb?: string }): string {
  try {
    return pb.files.getURL(image, image.image, options);
  } catch (error) {
    console.error('Błąd generowania URL obrazu:', error);
    return '';
  }
}

// analogicznie jak getImageUrl, tylko w niższych rozmiarach
export function getImageThumbnailUrl(image: OfferImage, dimensions: string = IMAGE_CONFIG.THUMBNAIL_SIZE): string {
  return getImageUrl(image, { thumb: dimensions });
}

// pobieram obrazek Usera
export function getUserAvatar(user: User){
  
  return pb.files.getURL(user, user?.avatar || '');
}

// Upload wielu zdjęć do oferty podczas jej tworzenia (jako osobne rekordy w kolekcji images)
export async function uploadOfferImages(offerId: string, files: File[]): Promise<void> {
  if (files.length === 0) return;

  try {
    // Twórz osobny rekord w kolekcji 'images' dla każdego pliku
    const uploadPromises = files.map((file, index) => 
      createOfferImage({
        offer_id: offerId,
        image: file,
        order: index,
      })
    );

    await Promise.all(uploadPromises);
  } catch (error: any) {
    throw new Error(error?.message || 'Nie udało się przesłać zdjęć');
  }
}