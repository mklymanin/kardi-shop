export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white/60">
      <div className="mx-auto grid max-w-6xl gap-4 px-6 py-10 text-sm text-ink/70 md:grid-cols-3">
        <div>
          <div className="font-semibold text-ink">shop.kardi</div>
          <p>Новый каталог медицинского оборудования с управлением через Strapi.</p>
        </div>
        <div>
          <div className="font-semibold text-ink">Разделы</div>
          <p>Каталог, формы заявок, корзина, SEO-страницы.</p>
        </div>
        <div>
          <div className="font-semibold text-ink">Интеграции</div>
          <p>Email-уведомления, аналитика, CAPTCHA, миграция контента.</p>
        </div>
      </div>
    </footer>
  );
}
