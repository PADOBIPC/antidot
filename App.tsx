import { useEffect, useMemo, useState } from "react";

type Language = "UA" | "EN";
type Currency = "UAH" | "EUR";
type Size = "S" | "M" | "L" | "XL";
type CartItem = { name: string; size: Size; price: number; qty: number };

const productImages = {
  front:
    "https://images.unsplash.com/photo-1778759335272-2aea6c337a63?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
  back: "https://images.unsplash.com/photo-1780566034595-8abc6d9207a4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
};

const copy = {
  UA: {
    catalog: "КАТАЛОГ",
    next: "СКОРО",
    cart: "КОШИК",
    heroMeta: "240 GSM ВАЖКА БАВОВНА",
    heroSub: "OVERSIZED КРІЙ / ЗРОБЛЕНО В КИЄВІ",
    viewDrop: "ПЕРЕГЛЯНУТИ ДРОП",
    available: "ДОСТУПНО ЗАРАЗ / ЛІМІТОВАНИЙ ТИРАЖ",
    description:
      "100% важка бавовна. Шовкотрафаретний принт, посилені шви та агресивний oversized силует. Створено в Києві.",
    selectSize: "ОБЕРІТЬ РОЗМІР",
    add: "ДОДАТИ В КОШИК",
    chapters: "НАСТУПНІ РОЗДІЛИ",
    cartMeta: "ВАШ ВИБІР",
    recipient: "ДАНІ ОТРИМУВАЧА",
    delivery: "ДОСТАВКА ПО УКРАЇНІ",
    payment: "СПОСІБ ОПЛАТИ",
    card: "Карта онлайн",
    cod: "Післяплата",
    consent: "Я погоджуюся на обробку моїх персональних даних.",
    total: "РАЗОМ",
    checkout: "ОФОРМИТИ ЗАМОВЛЕННЯ",
    empty: "ВАШ КОШИК ПОРОЖНІЙ",
    added: "ДОДАНО ДО КОШИКА",
    confirmed: "ЗАМОВЛЕННЯ ПІДТВЕРДЖЕНО",
    noSpoilers: "БЕЗ ФОТО. БЕЗ СПОЙЛЕРІВ.",
    name: "Ім’я та прізвище",
    phone: "Номер телефону",
    email: "Email",
    city: "Місто",
    address: "Номер відділення або адреса",
  },
  EN: {
    catalog: "CATALOG",
    next: "COMING",
    cart: "CART",
    heroMeta: "240 GSM HEAVYWEIGHT COTTON",
    heroSub: "OVERSIZED CUT / MADE IN KYIV",
    viewDrop: "VIEW THE DROP",
    available: "AVAILABLE NOW / LIMITED RUN",
    description:
      "100% heavyweight cotton. Screen-printed graphic, reinforced seams and an aggressive oversized silhouette. Made in Kyiv.",
    selectSize: "SELECT SIZE",
    add: "ADD TO CART",
    chapters: "NEXT CHAPTERS",
    cartMeta: "YOUR SELECTION",
    recipient: "RECIPIENT DETAILS",
    delivery: "DELIVERY IN UKRAINE",
    payment: "PAYMENT METHOD",
    card: "Card online",
    cod: "Cash on delivery",
    consent: "I agree to the processing of my personal data.",
    total: "TOTAL",
    checkout: "CHECKOUT",
    empty: "YOUR CART IS EMPTY",
    added: "ADDED TO CART",
    confirmed: "ORDER CONFIRMED",
    noSpoilers: "NO IMAGES. NO SPOILERS.",
    name: "Full name",
    phone: "Phone number",
    email: "Email",
    city: "City",
    address: "Parcel office number or address",
  },
};

function ProductImage({ className = "" }: { className?: string }) {
  return (
    <div className={`product-image cut ${className}`}>
      <img className="front" src={productImages.front} alt="ST. OLGA oversized tee front" />
      <img className="back" src={productImages.back} alt="ST. OLGA oversized tee back" />
      <div className="image-wash" />
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>("UA");
  const [currency, setCurrency] = useState<Currency>("UAH");
  const [size, setSize] = useState<Size>("L");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("antidot-cart") || "[]") as CartItem[];
    } catch {
      return [];
    }
  });
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    delivery: "Nova Poshta",
    payment: "Card online",
    consent: false,
  });

  const t = copy[language];
  const quantity = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const money = (amount: number) =>
    currency === "UAH"
      ? `${amount.toLocaleString("uk-UA")} UAH`
      : `${Math.round(amount / 45).toLocaleString("en-US")} €`;

  useEffect(() => localStorage.setItem("antidot-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => {
    document.documentElement.lang = language === "UA" ? "uk" : "en";
  }, [language]);
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);

  const updateQuantity = (index: number, delta: number) => {
    setCart((current) =>
      current
        .map((item, itemIndex) => (itemIndex === index ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0),
    );
  };

  const addToCart = () => {
    setCart((current) => {
      const match = current.find((item) => item.size === size);
      return match
        ? current.map((item) => (item === match ? { ...item, qty: item.qty + 1 } : item))
        : [...current, { name: "ST. OLGA / KYIV TEE", size, price: 2400, qty: 1 }];
    });
    setToast(t.added);
  };

  const requiredFields = useMemo(() => ["name", "phone", "email", "city", "address"] as const, []);
  const checkout = () => {
    const invalid: string[] = requiredFields.filter((field) => !form[field].trim());
    if (form.phone.replace(/\D/g, "").length < 10) invalid.push("phone");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) invalid.push("email");
    if (!form.consent) invalid.push("consent");
    setErrors([...new Set(invalid)]);
    if (!cart.length) {
      setToast(t.empty);
      return;
    }
    if (invalid.length) {
      setToast(language === "UA" ? "ПЕРЕВІРТЕ ДАНІ ЗАМОВЛЕННЯ" : "CHECK YOUR ORDER DETAILS");
      return;
    }
    localStorage.setItem(
      "antidot-last-order",
      JSON.stringify({
        customer: form,
        items: cart,
        total,
        createdAt: new Date().toISOString(),
      }),
    );
    setSubmitted(true);
    setCart([]);
    setToast(t.confirmed);
  };

  const updateForm = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => current.filter((error) => error !== field));
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#f5f5f5]">
      <div className={`toast ${toast ? "toast-visible" : ""}`} role="status">
        {toast}
      </div>
      <header className="site-header">
        <nav className="header-nav" aria-label="Primary navigation">
          <a href="#drop">{t.catalog}</a>
          <span>/</span>
          <a href="#next">{t.next}</a>
        </nav>
        <a className="brand" href="#top" aria-label="Antidot home">
          ANTIDOT<span>.</span>
        </a>
        <div className="header-actions">
          <button
            className="currency-button interactive"
            onClick={() => setCurrency(currency === "UAH" ? "EUR" : "UAH")}
          >
            {currency === "UAH" ? "UAH (₴)" : "EUR (€)"}
          </button>
          <button
            className={`language-toggle ${language === "EN" ? "is-en" : ""}`}
            onClick={() => setLanguage(language === "UA" ? "EN" : "UA")}
            aria-label="Change language"
          >
            <span>UA</span>
            <span>EN</span>
          </button>
          <button className="cart-button interactive" onClick={() => setDrawerOpen(true)}>
            {t.cart} <span>({quantity})</span>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-number" aria-hidden="true">
            01
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">// DROP 01 / KYIV FOUNDATIONS</p>
              <h1>
                ST.
                <br />
                OLGA
                <br />
                <span>TEE</span>
              </h1>
              <p className="hero-meta">
                {t.heroMeta}
                <br />
                {t.heroSub}
              </p>
              <a href="#drop" className="primary-button interactive">
                {t.viewDrop} <b>↘</b>
              </a>
            </div>
            <div className="hero-media">
              <ProductImage />
              <span className="limited-label">001 / LIMITED</span>
              <span className="flip-label">HOVER / FLIP</span>
            </div>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            ANTIDOT® — NO CURE FOR ORDINARY — KYIV / UKRAINE — ANTIDOT® — NO CURE FOR ORDINARY —
            KYIV / UKRAINE —
          </div>
        </div>

        <section id="drop" className="product-section">
          <div className="product-grid">
            <div className="catalog-media">
              <ProductImage />
              <span>ANTIDOT / 001</span>
            </div>
            <div className="product-details cut">
              <p className="eyebrow">{t.available}</p>
              <h2>
                ST. OLGA
                <br />
                <span>KYIV TEE</span>
              </h2>
              <p className="description">{t.description}</p>
              <div className="price-row">
                <strong>{money(2400)}</strong>
                <span>240 GSM / COTTON</span>
              </div>
              <div className="size-heading">
                <span>{t.selectSize}</span>
                <b>{size}</b>
              </div>
              <div className="size-grid">
                {(["S", "M", "L", "XL"] as Size[]).map((item) => (
                  <button
                    key={item}
                    className={size === item ? "is-selected" : ""}
                    onClick={() => setSize(item)}
                    aria-pressed={size === item}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button className="add-button interactive" onClick={addToCart}>
                {t.add} <span>+</span>
              </button>
            </div>
          </div>
        </section>

        <section id="next" className="chapters-section">
          <div className="chapters-inner">
            <div className="section-heading">
              <div>
                <p className="eyebrow">// INCOMING TRANSMISSIONS</p>
                <h2>{t.chapters}</h2>
              </div>
              <span>{t.noSpoilers}</span>
            </div>
            <div className="chapter-grid">
              {[
                ["02", "COMING SOON / 2025", "DUSK / KYIV"],
                ["03", "IN DEVELOPMENT", "CONCRETE POETRY"],
                ["04", "IN DEVELOPMENT", "AFTER DARK"],
              ].map(([number, meta, title]) => (
                <article className="chapter-card cut" key={number}>
                  <b>{number}</b>
                  <div>
                    <small>{meta}</small>
                    <h3>{title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <b>ANTIDOT®</b>
        <span>KYIV, UKRAINE / EST. 2024</span>
        <span>ALL RIGHTS RESERVED</span>
      </footer>

      <button
        className={`drawer-overlay ${drawerOpen ? "is-open" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-label="Close cart"
        tabIndex={drawerOpen ? 0 : -1}
      />
      <aside
        className={`cart-drawer ${drawerOpen ? "is-open" : ""}`}
        aria-hidden={!drawerOpen}
        aria-label={t.cart}
      >
        <div className="drawer-heading">
          <div>
            <p className="eyebrow">// {t.cartMeta}</p>
            <h2>{t.cart}</h2>
          </div>
          <button onClick={() => setDrawerOpen(false)} aria-label="Close cart">
            ×
          </button>
        </div>
        <div className="cart-items">
          {submitted && !cart.length ? (
            <div className="order-success">
              <b>ORDER / CONFIRMED</b>
              <span>
                {language === "UA" ? "Дякуємо за замовлення." : "Thank you for your order."}
              </span>
            </div>
          ) : cart.length ? (
            cart.map((item, index) => (
              <div className="cart-item" key={`${item.size}-${index}`}>
                <div>
                  <b>{item.name}</b>
                  <span>
                    SIZE {item.size} / {money(item.price)}
                  </span>
                </div>
                <div className="quantity">
                  <button onClick={() => updateQuantity(index, -1)} aria-label="Decrease quantity">
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQuantity(index, 1)} aria-label="Increase quantity">
                    +
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-cart">{t.empty}</div>
          )}
        </div>

        <div className="checkout-form">
          <div>
            <label className="form-label">{t.recipient}</label>
            <div className="input-stack">
              {(["name", "phone", "email", "city"] as const).map((field) => (
                <input
                  key={field}
                  className={errors.includes(field) ? "invalid" : ""}
                  type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                  value={form[field]}
                  onChange={(event) => updateForm(field, event.target.value)}
                  placeholder={t[field]}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="form-label">{t.delivery}</label>
            <div className="option-stack">
              {["Nova Poshta", "Nova Poshta — parcel locker", "Ukrposhta"].map((method) => (
                <label className="radio-option" key={method}>
                  <input
                    type="radio"
                    name="delivery"
                    checked={form.delivery === method}
                    onChange={() => updateForm("delivery", method)}
                  />
                  <span>{method}</span>
                  <i />
                </label>
              ))}
            </div>
            <input
              className={`standalone-input ${errors.includes("address") ? "invalid" : ""}`}
              value={form.address}
              onChange={(event) => updateForm("address", event.target.value)}
              placeholder={t.address}
            />
          </div>
          <div>
            <label className="form-label">{t.payment}</label>
            <div className="payment-grid">
              {[
                ["Card online", t.card],
                ["Cash on delivery", t.cod],
              ].map(([value, label]) => (
                <label className="radio-option" key={value}>
                  <input
                    type="radio"
                    name="payment"
                    checked={form.payment === value}
                    onChange={() => updateForm("payment", value)}
                  />
                  <span>{label}</span>
                  <i />
                </label>
              ))}
            </div>
          </div>
          <label className={`consent ${errors.includes("consent") ? "invalid" : ""}`}>
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(event) => updateForm("consent", event.target.checked)}
            />
            <span>{t.consent}</span>
          </label>
          <div className="total-row">
            <span>{t.total}</span>
            <b>{money(total)}</b>
          </div>
          <button className="checkout-button interactive" onClick={checkout}>
            {t.checkout}
          </button>
        </div>
      </aside>
    </div>
  );
}
