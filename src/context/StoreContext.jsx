import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { enquiryText, getProduct, waLink } from "../data/catalog.js";

const StoreContext = createContext(null);

// localStorage can throw (private mode, blocked storage) — never let it break the page
function usePersisted(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(`rajani:${key}`);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(`rajani:${key}`, JSON.stringify(value)); } catch { /* ignore */ }
  }, [key, value]);
  return [value, setValue];
}

export const lineKey = ({ id, size }) => [id, size || ""].join("|");

export function StoreProvider({ children }) {
  // The "bag" is an enquiry list: pieces are priced by the team over WhatsApp
  const [cart, setCart] = usePersisted("enquiry", []);
  const [wishlist, setWishlist] = usePersisted("wishlist", []);
  const [recent, setRecent] = usePersisted("recent", []);
  const [user, setUser] = usePersisted("user", null);
  const [orders, setOrders] = usePersisted("enquiries", []);

  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const notify = useCallback((text, action) => {
    clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), text, action });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const addToCart = useCallback((product, options = {}) => {
    const line = { id: product.id, size: options.size || "" };
    const key = lineKey(line);
    const qty = options.qty || 1;
    setCart((prev) => {
      const found = prev.find((i) => i.key === key);
      return found
        ? prev.map((i) => (i.key === key ? { ...i, qty: Math.min(10, i.qty + qty) } : i))
        : [...prev, { ...line, key, qty }];
    });
    if (!options.silent) notify(`${product.name} added to your enquiry list`, { label: "View list", run: () => setCartOpen(true) });
  }, [notify, setCart]);

  const changeQty = useCallback((key, delta) =>
    setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(10, i.qty + delta)) } : i))), [setCart]);
  const removeLine = useCallback((key) => setCart((prev) => prev.filter((i) => i.key !== key)), [setCart]);
  const clearCart = useCallback(() => setCart([]), [setCart]);

  const toggleWish = useCallback((product) => {
    const liked = wishlist.includes(product.id);
    setWishlist((prev) => (liked ? prev.filter((id) => id !== product.id) : [product.id, ...prev]));
    notify(liked ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`);
  }, [wishlist, notify, setWishlist]);

  const trackView = useCallback((id) =>
    setRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8)), [setRecent]);

  const lines = useMemo(() => cart
    .map((line) => {
      const product = getProduct(line.id);
      return product ? { ...line, product } : null;
    })
    .filter(Boolean), [cart]);

  const totals = useMemo(() => ({ count: lines.reduce((n, l) => n + l.qty, 0) }), [lines]);

  // Opens WhatsApp with the whole list, and keeps a copy on this device
  const placeOrder = useCallback((details) => {
    const id = `RJ${Date.now().toString().slice(-8)}`;
    const enquiry = {
      id,
      date: new Date().toISOString(),
      items: lines.map(({ product, key, ...l }) => ({ ...l, name: product.name, code: product.code, image: product.images[0] })),
      ...details,
    };
    window.open(waLink(enquiryText(lines, details)), "_blank", "noopener");
    setOrders((prev) => [enquiry, ...prev]);
    clearCart();
    return id;
  }, [lines, setOrders, clearCart]);

  const value = {
    cart, lines, totals, addToCart, changeQty, removeLine, clearCart,
    wishlist, toggleWish,
    recent, trackView,
    user, setUser, orders, placeOrder,
    cartOpen, setCartOpen, searchOpen, setSearchOpen, quickViewId, setQuickViewId,
    toast, setToast, notify,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
