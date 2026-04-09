export type Product = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  excerpt?: string;
  description?: string;
  price: string;
  priceValue?: number;
  category: string;
  categorySlug?: string;
  imageUrl?: string;
  imageUrls?: string[];
  seoTitle?: string;
  seoDescription?: string;
};
