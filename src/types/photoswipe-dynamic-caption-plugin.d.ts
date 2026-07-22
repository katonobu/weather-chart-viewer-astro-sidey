// src/types/photoswipe-dynamic-caption-plugin.d.ts
declare module 'photoswipe-dynamic-caption-plugin' {
  import PhotoSwipeLightbox from 'photoswipe/lightbox';

  export default class PhotoSwipeDynamicCaption {
    constructor(lightbox: PhotoSwipeLightbox, options?: Record<string, any>);
    init(): void;
    destroy(): void;
  }
}