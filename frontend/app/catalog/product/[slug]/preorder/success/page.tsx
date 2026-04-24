import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/api/products";

type PageParams = {
  params: Promise<{ slug: string }>;
};

export default async function PreorderSuccessPage({ params }: PageParams) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-2xl uppercase sm:text-3xl">
          Заявка принята
        </h1>
        <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
          {product ? (
            <>
              Мы получили предзаказ
              {product.title ? ` на «${product.title}»` : ""}. Менеджер свяжется
              с вами, когда товар снова будет в наличии.
            </>
          ) : (
            "Мы получили предзаказ. Менеджер свяжется с вами."
          )}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {product ? (
            <ButtonLink
              href={`/catalog/product/${slug}`}
              className="h-11 rounded-xl px-6"
            >
              К карточке товара
            </ButtonLink>
          ) : null}
          <ButtonLink
            href="/catalog"
            variant="outline"
            className="h-11 rounded-xl border-black px-6"
          >
            В каталог
          </ButtonLink>
        </div>
        <p className="text-muted-foreground mt-6 text-xs">
          Оплата на сайте не проводилась.
        </p>
      </div>
    </Container>
  );
}
