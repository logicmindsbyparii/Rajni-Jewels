import Button from "../components/Button.jsx";
import { useTitle } from "../components/FloatingActions.jsx";

export default function NotFound() {
  useTitle("Page not found");
  return (
    <div className="section-container success not-found">
      <p className="eyebrow">404</p>
      <h1>This piece has gone missing.</h1>
      <p className="muted">The page you're looking for doesn't exist or has moved.</p>
      <div className="center-row">
        <Button to="/" variant="dark">Back home</Button>
        <Button to="/shop" variant="gold">Our products</Button>
      </div>
    </div>
  );
}
