import { useState } from "react";
import { ArrowRight, ClipboardList, Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Modal from "./Modal.jsx";
import SafeImage from "./SafeImage.jsx";
import ProductOptions, { useProductOptions } from "./ProductOptions.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { enquiryText, getProduct, waLink } from "../data/catalog.js";

export default function QuickView() {
  const { quickViewId, setQuickViewId } = useStore();
  const product = quickViewId ? getProduct(quickViewId) : null;
  const close = () => setQuickViewId(null);

  return (
    <Modal open={!!product} onClose={close} title={product?.name} wide>
      {product && <QuickViewBody key={product.id} product={product} onClose={close} />}
    </Modal>
  );
}

function QuickViewBody({ product, onClose }) {
  const { addToCart, wishlist, toggleWish } = useStore();
  const opts = useProductOptions(product);
  const [image, setImage] = useState(0);
  const liked = wishlist.includes(product.id);

  const add = () => {
    addToCart(product, { size: opts.size });
    onClose();
  };

  return (
    <div className="quickview">
      <div className="quickview-media">
        <SafeImage id={product.images[image]} alt={product.name} widths={[600, 900, 1200]} sizes="(max-width: 800px) 90vw, 440px" />
        {product.images.length > 1 && (
          <div className="quickview-thumbs">
            {product.images.map((img, i) => (
              <button key={img.src} className={i === image ? "is-active" : ""} onClick={() => setImage(i)} aria-label={`Image ${i + 1}`}>
                <SafeImage id={img} alt="" widths={[120, 160]} sizes="60px" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="quickview-info">
        <p className="eyebrow">{product.typeName} · {product.code}</p>
        <h2>{product.name}</h2>
        <div className="product-price is-large"><strong>Price on request</strong></div>
        <p className="muted small">{product.metal}{product.certification ? ` · ${product.certification}` : ""}</p>
        <ProductOptions product={product} opts={opts} />
        <div className="buy-row">
          <button className="btn btn-gold" onClick={add}><span className="btn-label"><ClipboardList size={17} /> Add to enquiry</span></button>
          <button className={`icon-button wish-lg ${liked ? "is-liked" : ""}`} aria-pressed={liked} aria-label="Save to wishlist" onClick={() => toggleWish(product)}>
            <Heart size={19} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>
        <a className="btn btn-dark btn-block" href={waLink(enquiryText([{ product, size: opts.size }]))} target="_blank" rel="noreferrer"><span className="btn-label"><MessageCircle size={17} /> Enquire on WhatsApp</span></a>
        <Link className="text-link" to={`/product/${product.id}`} onClick={onClose}>View full details <ArrowRight size={15} /></Link>
      </div>
    </div>
  );
}
