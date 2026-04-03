export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white/60">
      <div className="text-ink/70 mx-auto grid max-w-6xl gap-4 px-6 py-10 text-sm md:grid-cols-3">
        <div>
          <div className="text-ink font-semibold">shop.kardi</div>
          <p>
            Новый каталог медицинского оборудования с управлением через Strapi.
          </p>
        </div>
        <div>
          <div className="text-ink font-semibold">Разделы</div>
          <p>Каталог, формы заявок, корзина, SEO-страницы.</p>
        </div>
        <div>
          <div className="text-ink font-semibold">Интеграции</div>
          <p>Email-уведомления, аналитика и CAPTCHA.</p>
        </div>
      </div>
    </footer>
  );
}
