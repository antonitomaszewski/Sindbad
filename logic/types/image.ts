export interface OfferImage {
  id: string;
  offer_id: string;
  image: string;           // PocketBase file field
  alt_text?: string;
  order: number;
  created: string;
  updated: string;
}

export interface CreateOfferImageData {
  offer_id: string;
  image: File;             // For uploads
  alt_text?: string;
  order?: number;
}