import { Suspense, lazy, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Box, CalendarCheck, ChevronDown, ClipboardList, Heart, MessageCircle, Phone, RefreshCcw, Share2, ShieldCheck, Truck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import SafeImage from "../components/SafeImage.jsx";
import ProductCard from "../components/ProductCard.jsx";
import RecentlyViewed from "../components/RecentlyViewed.jsx";
import ProductOptions, { useProductOptions } from "../components/ProductOptions.jsx";
import { SectionHead } from "../components/Reveal.jsx";
import { useTitle } from "../components/FloatingActions.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { CATEGORIES, COLORS, COMPANY, PRODUCTS, describe, enquiryText, getProduct, waLink } from "../data/catalog.js";
import NotFound from "./NotFound.jsx";

const RingViewer = lazy(() => import("../three/RingViewer.jsx"));

export default function Product() {
  const { id } = useParams();
  const product = getProduct(id);
  if (!product) return <NotFound />;
  return <ProductView key={product.id} product={product} />;
}

function Gallery({ product }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(null);
  const canSpin = /ring/.test(product.type);
  const is3D = index === product.images.length;

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div className="gallery">
      <div className="gallery-thumbs">
        {product.images.map((img, i) => (
          <button key={img.src} className={index === i ? "is-active" : ""} onClick={() => setIndex(i)} aria-label={`Show image ${i + 1}`}>
            <SafeImage id={img} alt="" widths={[160, 240]} sizes="80px" />
          </button>
        ))}
        {canSpin && <button className={`thumb-3d ${is3D ? "is-active" : ""}`} onClick={() => setIndex(product.images.length)}><Box size={20} /><span>3D</span></button>}
      </div>
      <div className="gallery-main">
        <AnimatePresence mode="wait">
          {is3D ? (
            <motion.div key="3d" className="gallery-3d" initial={{ opacity: 0, rotateY: -20 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <Suspense fallback={<div className="canvas-loading"><span /></div>}>
                <RingViewer metal={COLORS[product.colors[0]].hex} gem={product.gem} />
              </Suspense>
              <span className="gallery-note">Drag to rotate · illustrative 3D preview</span>
            </motion.div>
          ) : (
            <motion.div key={index} className={`gallery-photo ${zoom ? "is-zoomed" : ""}`} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onMouseMove={onMove} onMouseLeave={() => setZoom(null)} style={{ "--zoom-origin": zoom || "center" }}>
              <SafeImage id={product.images[index]} alt={product.name} widths={[700, 1100, 1600]} sizes="(max-width: 900px) 100vw, 50vw" priority />
              {product.badge && <span className="product-badge">{product.badge}</span>}
              {canSpin && <button className="spin-cta" onClick={() => setIndex(product.images.length)}><Box size={15} /> View in 3D</button>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Accordion({ title, children, open: initial = false }) {
  const [open, setOpen] = useState(initial);
  return (
    <div className={`accordion ${open ? "is-open" : ""}`}>
      <button onClick={() => setOpen(!open)} aria-expanded={open}>{title}<ChevronDown size={18} /></button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }}>
            <div className="accordion-body">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductView({ product }) {
  const { addToCart, wishlist, toggleWish, trackView, notify } = useStore();
  const opts = useProductOptions(product);
  const [qty, setQty] = useState(1);
  const liked = wishlist.includes(product.id);
  const category = CATEGORIES.find((c) => c.id === product.category);
  const whatsapp = waLink(enquiryText([{ product, qty, size: opts.size }]));
  useTitle(product.name);

  useEffect(() => { trackView(product.id); }, [product.id, trackView]);

  const add = () => addToCart(product, { size: opts.size, qty });

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.name, url });
      else { await navigator.clipboard.writeText(url); notify("Link copied to clipboard"); }
    } catch { /* user cancelled */ }
  };

  const similar = PRODUCTS.filter((p) => p.id !== product.id && p.type === product.type).slice(0, 4);

  return (
    <>
      <div className="section-container pdp">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link> / <Link to={`/shop/${category.id}`}>{category.name}</Link> / <Link to={`/shop/${category.id}?type=${product.type}`}>{product.typeName}</Link> / <span aria-current="page">{product.name}</span>
        </nav>

        <div className="pdp-grid">
          <Gallery product={product} />

          <div className="pdp-info">
            <p className="eyebrow">{product.metal} · {product.code}</p>
            <h1>{product.name}</h1>

            <div className="product-price is-large"><strong>Price on request</strong></div>
            <p className="muted small">Send an enquiry and our team will share the latest price, weight and delivery time.</p>

            <ProductOptions product={product} opts={opts} />

            <div className="buy-row">
              <div className="qty is-lg">
                <button aria-label="Decrease quantity" onClick={() => setQty((n) => Math.max(1, n - 1))}>−</button>
                <span>{qty}</span>
                <button aria-label="Increase quantity" onClick={() => setQty((n) => Math.min(10, n + 1))}>+</button>
              </div>
              <button className="btn btn-gold grow" onClick={add}><span className="btn-label"><ClipboardList size={17} /> Add to enquiry</span></button>
              <button className={`icon-button wish-lg ${liked ? "is-liked" : ""}`} aria-pressed={liked} aria-label="Save to wishlist" onClick={() => toggleWish(product)}><Heart size={19} fill={liked ? "currentColor" : "none"} /></button>
              <button className="icon-button wish-lg" aria-label="Share" onClick={share}><Share2 size={18} /></button>
            </div>
            <a className="btn btn-dark btn-block" href={whatsapp} target="_blank" rel="noreferrer"><span className="btn-label"><MessageCircle size={17} /> Enquiry now on WhatsApp</span></a>

            <div className="pdp-assist">
              <a href={`tel:${COMPANY.tel}`}><Phone size={16} /> {COMPANY.phone}</a>
              <Link to="/appointment?type=custom"><CalendarCheck size={16} /> Customise this design</Link>
            </div>

            <ul className="pdp-trust">
              <li><Truck size={20} strokeWidth={1.5} />Free delivery</li>
              <li><RefreshCcw size={20} strokeWidth={1.5} />Easy returns</li>
              <li><ShieldCheck size={20} strokeWidth={1.5} />Secure payments</li>
              <li><BadgeCheck size={20} strokeWidth={1.5} />{product.certification || "Quality assured"}</li>
            </ul>

            <Accordion title="Product details" open>
              <dl className="specs">
                <div><dt>Product type</dt><dd>{product.typeName}</dd></div>
                {product.attrs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                <div><dt>Product code</dt><dd>{product.code}</dd></div>
              </dl>
            </Accordion>
            <Accordion title="Description"><p>{describe(product)}</p></Accordion>
            <Accordion title="Delivery, returns & payment">
              <p>Free delivery on all products across India, usually in 5–10 working days depending on availability and location. Returns and exchanges are accepted on selected products within 3–7 days of delivery — customised and made-to-order pieces are not returnable. We accept online bank transfer, UPI and other secure payment methods; details are shared when your order is confirmed. <Link to="/policies/refund-returns">Read the full return policy</Link>.</p>
            </Accordion>
          </div>
        </div>
      </div>

      <div className="sticky-buy">
        <div><strong>{product.name}</strong><small>{product.code} · Price on request</small></div>
        <a className="btn btn-gold" href={whatsapp} target="_blank" rel="noreferrer"><span className="btn-label"><MessageCircle size={16} /> Enquire</span></a>
      </div>

      {similar.length > 0 && (
        <section className="section section-tint">
          <div className="section-container">
            <SectionHead eyebrow="You may also like" title={<>More <em>{product.typeName.toLowerCase()}</em></>} />
            <div className="product-grid">{similar.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </div>
        </section>
      )}
      <RecentlyViewed exclude={product.id} />
    </>
  );
}
