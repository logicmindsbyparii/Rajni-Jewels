import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Loader from "./components/Loader.jsx";
import { IntroContext } from "./context/IntroContext.js";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import SearchOverlay from "./components/SearchOverlay.jsx";
import QuickView from "./components/QuickView.jsx";
import Toast from "./components/Toast.jsx";
import { FloatingActions, ScrollManager } from "./components/FloatingActions.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Product from "./pages/Product.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Account, { OrderSuccess } from "./pages/Account.jsx";
import Appointment from "./pages/Appointment.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import Gallery from "./pages/Gallery.jsx";
import DiamondPurchase from "./pages/DiamondPurchase.jsx";
import Policy from "./pages/Policy.jsx";
import Help from "./pages/Help.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  const finishIntro = useCallback(() => setReady(true), []);
  // Every fresh visit lands on the home page: whatever URL was opened, the
  // loader plays over the home page and reveals it once the 3D hero has rendered
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // Browsers restore the old scroll position on refresh; always start at the hero
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    if (pathname !== "/" || window.location.hash) navigate("/", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (ready) window.scrollTo({ top: 0, behavior: "instant" });
  }, [ready]);

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={ready}>
      <AnimatePresence>{!ready && <Loader key="loader" onDone={finishIntro} waitForScene />}</AnimatePresence>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <ScrollManager />
      <a className="skip-link" href="#main">Skip to content</a>

      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderSuccess />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/stores" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/diamond-purchase" element={<DiamondPurchase />} />
          <Route path="/policies/:id" element={<Policy />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />

      <CartDrawer />
      <SearchOverlay />
      <QuickView />
      <Toast />
      <FloatingActions />
      </IntroContext.Provider>
    </MotionConfig>
  );
}
