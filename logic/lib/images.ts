import pb from './pocketbase';
import { OfferImage, CreateOfferImageData } from '../types/image';
import { IMAGE_CONFIG } from '@/look/constants/image';

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

export async function getOfferPrimaryImage(offerId: string): Promise<OfferImage | null> {
  try {
    const image = await pb.collection('images').getFirstListItem<OfferImage>(
      `offer_id = "${offerId}" && is_primary = true`
    );
    return image;
  } catch (error) {
    const images = await getOfferImages(offerId);
    return images[0] || null;
  }
}

export async function createOfferImage(data: CreateOfferImageData): Promise<OfferImage | null> {
  try {
        // 1. Walidacja rozmiaru
    if (data.image.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
      throw new Error(`Plik jest za duży. Maksymalny rozmiar: ${IMAGE_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB. Twój plik: ${(data.image.size / 1024 / 1024).toFixed(1)}MB`);
    }

    // 2. Walidacja typu
    if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(data.image.type as any)) {
      throw new Error(`Nieprawidłowy format pliku. Dozwolone: JPG, PNG, WebP`);
    }

    const formData = new FormData();
    formData.append('offer_id', data.offer_id);
    formData.append('image', data.image);
    if (data.alt_text) formData.append('alt_text', data.alt_text);
    formData.append('order', String(data.order || 0));
    formData.append('is_primary', String(data.is_primary || false));

    const image = await pb.collection('images').create<OfferImage>(formData);
    return image;
  } catch (error: any) {
    if (error.message.includes('za duży') || error.message.includes('format')) {
      throw error;
    }
    
    console.error('Błąd dodawania zdjęcia:', error);
    throw new Error('Nie udało się dodać zdjęcia. Spróbuj ponownie.');
  }
}

export async function deleteOfferImage(imageId: string): Promise<boolean> {
  try {
    await pb.collection('images').delete(imageId);
    return true;
  } catch (error) {
    console.error('Błąd usuwania zdjęcia:', error);
    return false;
  }
}

export async function updateImageOrder(imageId: string, newOrder: number): Promise<boolean> {
  try {
    await pb.collection('images').update(imageId, { order: newOrder });
    return true;
  } catch (error) {
    console.error('Błąd aktualizacji kolejności:', error);
    return false;
  }
}

export async function setImageAsPrimary(imageId: string, offerId: string): Promise<boolean> {
  try {
    const allImages = await getOfferImages(offerId);
    await Promise.all(
      allImages.map(img => 
        pb.collection('images').update(img.id, { is_primary: false })
      )
    );
    
    await pb.collection('images').update(imageId, { is_primary: true });
    return true;
  } catch (error) {
    console.error('Błąd ustawiania głównego zdjęcia:', error);
    return false;
  }
}

export function getImageUrl(image: OfferImage, options?: { thumb?: string }): string {
  try {
    return pb.files.getURL(image, image.image, options);
  } catch (error) {
    console.error('Błąd generowania URL obrazu:', error);
    return ''; // Fallback
  }
}

export function getImageThumbnailUrl(image: OfferImage, dimensions: string = '300x200'): string {
  return getImageUrl(image, { thumb: dimensions });
}