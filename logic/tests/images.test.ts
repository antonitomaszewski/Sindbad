import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IMAGE_CONFIG } from '../constants/image';

const pbMock = vi.hoisted(() => ({
  collection: vi.fn(),
  getFullList: vi.fn(),
  create: vi.fn(),
  getURL: vi.fn(),
}));

vi.mock('../lib/pocketbase', () => ({
  default: {
    collection: pbMock.collection,
    files: {
      getURL: pbMock.getURL,
    },
  },
}));

import {
  createOfferImage,
  getImageThumbnailUrl,
  getImageUrl,
  getOfferImages,
  getUserAvatar,
  uploadOfferImages,
} from '../lib/images';
import type { OfferImage } from '../types/image';
import type { User } from '../types/user';

describe('images', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    pbMock.collection.mockReturnValue({
      getFullList: pbMock.getFullList,
      create: pbMock.create,
    });
  });

  it('getOfferImages returns offer images', async () => {
    const images = [
      { id: 'img1', offer_id: 'offer1', image: 'photo.jpg', order: 0 },
    ] as OfferImage[];

    pbMock.getFullList.mockResolvedValue(images);

    const result = await getOfferImages('offer1');

    expect(result).toBe(images);
    expect(pbMock.collection).toHaveBeenCalledWith('images');
    expect(pbMock.getFullList).toHaveBeenCalledWith({
      filter: 'offer_id = "offer1"',
      sort: '+order,+created',
    });
  });

  it('getOfferImages returns empty array on error', async () => {
    pbMock.getFullList.mockRejectedValue(new Error('PB error'));

    const result = await getOfferImages('offer1');

    expect(result).toEqual([]);
  });

  it('createOfferImage creates image record', async () => {
    const file = new File(['image'], 'photo.jpg', { type: 'image/jpeg' });

    await createOfferImage({
      offer_id: 'offer1',
      image: file,
      order: 0,
    });

    expect(pbMock.collection).toHaveBeenCalledWith('images');
    expect(pbMock.create).toHaveBeenCalledWith({
      offer_id: 'offer1',
      image: file,
      order: 0,
    });
  });

  it('createOfferImage rejects too large file', async () => {
    const file = new File(
      [new Uint8Array(IMAGE_CONFIG.MAX_FILE_SIZE + 1)],
      'big.jpg',
      { type: 'image/jpeg' }
    );

    await expect(
      createOfferImage({
        offer_id: 'offer1',
        image: file,
      })
    ).rejects.toThrow('Plik jest za duży');
  });

  it('createOfferImage rejects invalid file type', async () => {
    const file = new File(['text'], 'file.txt', { type: 'text/plain' });

    await expect(
      createOfferImage({
        offer_id: 'offer1',
        image: file,
      })
    ).rejects.toThrow('Nieprawidłowy format pliku');
  });

  it('getImageUrl returns PocketBase file URL', () => {
    const image = { image: 'photo.jpg' } as OfferImage;

    pbMock.getURL.mockReturnValue('http://pb/photo.jpg');

    const result = getImageUrl(image);

    expect(result).toBe('http://pb/photo.jpg');
    expect(pbMock.getURL).toHaveBeenCalledWith(image, 'photo.jpg', undefined);
  });

  it('getImageThumbnailUrl returns thumbnail URL', () => {
    const image = { image: 'photo.jpg' } as OfferImage;

    pbMock.getURL.mockReturnValue('http://pb/thumb.jpg');

    const result = getImageThumbnailUrl(image);

    expect(result).toBe('http://pb/thumb.jpg');
    expect(pbMock.getURL).toHaveBeenCalledWith(image, 'photo.jpg', {
      thumb: IMAGE_CONFIG.THUMBNAIL_SIZE,
    });
  });

  it('getUserAvatar returns user avatar URL', () => {
    const user = { avatar: 'avatar.jpg' } as User;

    pbMock.getURL.mockReturnValue('http://pb/avatar.jpg');

    const result = getUserAvatar(user);

    expect(result).toBe('http://pb/avatar.jpg');
    expect(pbMock.getURL).toHaveBeenCalledWith(user, 'avatar.jpg');
  });

  it('uploadOfferImages creates records for all files', async () => {
    const files = [
      new File(['one'], 'one.jpg', { type: 'image/jpeg' }),
      new File(['two'], 'two.png', { type: 'image/png' }),
    ];

    await uploadOfferImages('offer1', files);

    expect(pbMock.create).toHaveBeenCalledTimes(2);
    expect(pbMock.create).toHaveBeenNthCalledWith(1, {
      offer_id: 'offer1',
      image: files[0],
      order: 0,
    });
    expect(pbMock.create).toHaveBeenNthCalledWith(2, {
      offer_id: 'offer1',
      image: files[1],
      order: 1,
    });
  });
});