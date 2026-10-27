import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import SafeImage from "./SafeImage.jsx";
import Tilt from "./Tilt.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { COLORS } from "../data/catalog.js";

export default function ProductCard({ product }) {
  const { wishlist, toggleWish, addToCart, setQuickViewId } = useStore();
  const liked = wishlist.includes(product.id);
  const [first, second] = product.images;

  return (
    <Tilt className="product-card" max={6}>
      <div className="product-media">
        <Link to={`/product/${product.id}`} className="product-media-link" aria-label={product.name}>
          <SafeImage id={first} alt={product.name} widths={[400, 700, 1000]} sizes="(max-width: 700px) 50vw, 25vw" className="product-img-main" />
          {second && <SafeImage id={second} alt="" widths={[400, 700, 1000]} sizes="(max-width: 700px) 50vw, 25vw" className="product-img-alt" />}
        </Link>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <motion.button className={`wish-button ${liked ? "is-liked" : ""}`} aria-pressed={liked} aria-label={`${liked ? "Remove" : "Save"} ${product.name} ${liked ? "from" : "to"} wishlist`} onClick={() => toggleWish(product)} whileTap={{ scale: 0.8 }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={liked ? "on" : "off"} initial={{ scale: 0.3, rotate: -25 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.3 }} transition={{ type: "spring", stiffness: 520, damping: 16 }}>
              <Heart size={17} fill={liked ? "currentColor" : "none"} />
            </motion.span>
          </AnimatePresence>
        </motion.button>
        <div className="product-actions">
          <button onClick={() => addToCart(product)}><ClipboardList size={15} /> Add to enquiry</button>
          <button onClick={() => setQuickViewId(product.id)} aria-label={`Quick view ${product.name}`}><Eye size={16} /></button>
        </div>
      </div>
      <div className="product-info">
        <div className="product-meta">
          <span>{product.typeName}</span>
          <span className="swatches" aria-label="Metal colours">
            {product.colors.map((c) => <i key={c} style={{ background: COLORS[c].swatch }} title={COLORS[c].label} />)}
          </span>
        </div>
        <h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
        <div className="product-price">
          <strong>Price on request</strong>
          <em>{product.code}</em>
        </div>
      </div>
    </Tilt>
  );
}
