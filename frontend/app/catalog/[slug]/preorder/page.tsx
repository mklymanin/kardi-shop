import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { PreorderForm } from "@/app/catalog/[slug]/preorder/preorder-form";
import { Container } from "@/components/ui/container";
import { getProductBySlug } from "@/lib/api/products";

type PageParams = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Предзаказ" };
  }
  return {
    title: `Предзаказ — ${product.title}`,
    description: `Оформить предзаказ на ${product.title}`,
  };
}

export default async function PreorderPage({ params }: PageParams) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  if (product.stock > 0) {
    redirect(`/catalog/${slug}`);
  }

  return (
    <Container className="py-4 md:py-6">
      <PreorderForm product={product} />
    </Container>
  );
}
