// look/components/offer/OfferGallery.tsx
import { useState } from 'react';
import { Card } from '@/look/components/ui/Card';
import { useOfferImages } from '@/look/hooks/useOfferImages';
import { getImageUrl, getImageThumbnailUrl } from '@/logic/lib/images';
import { IMAGE_MESSAGES } from '@/look/constants/image';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface OfferGalleryProps {
  offerId: string;
}

export function OfferGallery({ offerId }: OfferGalleryProps) {
  const { images, loading, error } = useOfferImages(offerId);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (loading) {
    return (
      <Card>
        <h2 className="text-xl font-bold text-main mb-4">{IMAGE_MESSAGES.GALLERY_TITLE}</h2>
        <div className="flex justify-center items-center h-32">
          <p className="text-gray">{IMAGE_MESSAGES.LOADING}</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <h2 className="text-xl font-bold text-main mb-4">{IMAGE_MESSAGES.GALLERY_TITLE}</h2>
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </Card>
    );
  }

  if (!images || images.length === 0) {
    return (
      <Card>
        <h2 className="text-xl font-bold text-main mb-4">{IMAGE_MESSAGES.GALLERY_TITLE}</h2>
        <div className="text-center py-8">
          <p className="text-gray">{IMAGE_MESSAGES.NO_IMAGES}</p>
        </div>
      </Card>
    );
  }

  const sortedImages = images.sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return a.order - b.order;
  });

  const lightboxSlides = sortedImages.map(img => ({
    src: getImageUrl(img),
    alt: img.alt_text || 'Zdjęcie oferty'
  }));

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-main mb-4">
        {IMAGE_MESSAGES.GALLERY_TITLE} ({images.length})
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedImages.map((image, index) => (
          <div 
            key={image.id}
            className={`relative cursor-pointer hover:opacity-80 transition-opacity ${
              image.is_primary ? 'ring-2 ring-main rounded' : ''
            }`}
            onClick={() => handleImageClick(index)}
          >
            <img
              src={getImageThumbnailUrl(image)}
              alt={image.alt_text || 'Zdjęcie oferty'}
              className="w-full aspect-video object-cover rounded"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
      />
    </Card>
  );
}