import ProductCard from "./ProductCard.jsx";
import { SectionHead } from "./Reveal.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { getProduct } from "../data/catalog.js";

export default function RecentlyViewed({ exclude, title = "Recently viewed" }) {
  const { recent } = useStore();
  const items = recent.filter((id) => id !== exclude).map(getProduct).filter(Boolean).slice(0, 4);
  if (!items.length) return null;
  return (
    <section className="section">
      <div className="section-container">
        <SectionHead eyebrow="Pick up where you left off" title={title} />
        <div className="product-grid">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </div>
    </section>
  );
}
