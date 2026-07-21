import { useEffect } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';

export const usePhotoSwipe = (galleryId, childrenSelector) => {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${galleryId}`,
      children: childrenSelector,
      pswpModule: PhotoSwipe,
      wheelToZoom: true,
      allowPanToNext: true,
      preload: [0, 1],
    });

    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, [galleryId, childrenSelector]);
};