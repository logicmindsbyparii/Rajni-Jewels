import PageHeader from "../components/PageHeader.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Button from "../components/Button.jsx";
import { useTitle } from "../components/FloatingActions.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { getProduct } from "../data/catalog.js";

export default function Wishlist() {
  const { wishlist } = useStore();
  const items = wishlist.map(getProduct).filter(Boolean);
  useTitle("Wishlist");

  return (
    <>
      <PageHeader title="Your wishlist" sub={items.length ? `${items.length} saved ${items.length === 1 ? "piece" : "pieces"}. Add them to your enquiry list to get prices.` : null} crumbs={[{ label: "Wishlist" }]} />
      <div className="section-container">
        {items.length ? (
          <div className="product-grid is-shop">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        ) : (
          <div className="empty">
            <h3>Nothing saved yet</h3>
            <p className="muted">Tap the heart on any piece to keep it here.</p>
            <Button to="/shop" variant="gold">Explore jewellery</Button>
          </div>
        )}
      </div>
    </>
  );
}
