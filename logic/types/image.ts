export interface OfferImage {
  id: string;
  offer_id: string;
  image: string;
  alt_text?: string;
  order: number;
  created: string;
  updated: string;
}

export interface CreateOfferImageData {
  offer_id: string;
  image: File;
  alt_text?: string;
  order?: number;
}