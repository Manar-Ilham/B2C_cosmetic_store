import type { StaticImageData } from "next/image";
import productPomade1 from '@/app/assets/product-pomade-1.jpg';
import productLotion1 from '@/app/assets/product-lotion-1.jpg';
import productCreme1 from '@/app/assets/product-creme-1.jpg';

// Map product IDs to actual images
export const productImageMap: { [key: string]: string | StaticImageData } = {
  '1': productPomade1,
  '2': productPomade1,
  '3': productPomade1,
  '4': productLotion1,
  '5': productLotion1,
  '6': productLotion1,
  '7': productCreme1,
  '8': productCreme1,
  '9': productCreme1,
  '10': productPomade1,
  '11': productLotion1,
  '12': productCreme1,
};

export const getProductImage = (productId: string): string | StaticImageData => {
  return productImageMap[productId] || productPomade1; // fallback to first image
};