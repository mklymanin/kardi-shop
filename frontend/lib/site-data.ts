export type LineType = "purchase" | "rent";

export type Product = {
  id: number;
  slug: string;
  sku?: string;
  title: string;
  subtitle: string;
  excerpt?: string;
  description?: string;
  price: string;
  priceValue?: number;
  rentalAvailable?: boolean;
  rentalPrice?: string;
  rentalPriceValue?: number;
  rentalPeriodLabel?: string;
  category: string;
  categorySlug?: string;
  imageUrl?: string;
  imageUrls?: string[];
  seoTitle?: string;
  seoDescription?: string;
};
