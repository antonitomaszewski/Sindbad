import pb from './pocketbase';
import { OfferImage, CreateOfferImageData } from '../types/image';

export async function getOfferImages(offerId: string): Promise<OfferImage[]> {
  try {
    const images = await pb.collection('offer_images').getFullList<OfferImage>({
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
    const image = await pb.collection('offer_images').getFirstListItem<OfferImage>(
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
    const formData = new FormData();
    formData.append('offer_id', data.offer_id);
    formData.append('image', data.image);
    if (data.alt_text) formData.append('alt_text', data.alt_text);
    formData.append('order', String(data.order || 0));
    formData.append('is_primary', String(data.is_primary || false));

    const image = await pb.collection('offer_images').create<OfferImage>(formData);
    return image;
  } catch (error) {
    console.error('Błąd dodawania zdjęcia:', error);
    return null;
  }
}

export async function deleteOfferImage(imageId: string): Promise<boolean> {
  try {
    await pb.collection('offer_images').delete(imageId);
    return true;
  } catch (error) {
    console.error('Błąd usuwania zdjęcia:', error);
    return false;
  }
}

export async function updateImageOrder(imageId: string, newOrder: number): Promise<boolean> {
  try {
    await pb.collection('offer_images').update(imageId, { order: newOrder });
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
        pb.collection('offer_images').update(img.id, { is_primary: false })
      )
    );
    
    await pb.collection('offer_images').update(imageId, { is_primary: true });
    return true;
  } catch (error) {
    console.error('Błąd ustawiania głównego zdjęcia:', error);
    return false;
  }
}

export function getImageUrl(image: OfferImage, options?: { thumb?: string }): string {
  try {
    return pb.files.getUrl(image, 'image', options);
  } catch (error) {
    console.error('Błąd generowania URL obrazu:', error);
    return ''; // Fallback
  }
}

export function getImageThumbnailUrl(image: OfferImage, dimensions: string = '300x200'): string {
  return getImageUrl(image, { thumb: dimensions });
}