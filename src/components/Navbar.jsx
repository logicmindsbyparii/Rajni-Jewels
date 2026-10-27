import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ChevronDown, ClipboardList, Heart, Menu, Search, User, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import SafeImage from "./SafeImage.jsx";
import { useLockScroll } from "./Modal.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { CATEGORIES, COMPANY } from "../data/catalog.js";

const LINKS = [
  { label: "About us", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Diamond Purchase", to: "/diamond-purchase" },
  { label: "Contact us", to: "/contact" },
];

const OFFERS = [
  "Free delivery on all products across India",
  "Handcrafted Gold, Polki, Diamond & Gemstone Jewellery",
  "Easy returns · 100% secure payments",
  "Made in Surat, Crafted for the World",
];

function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % OFFERS.length), 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="announce" role="region" aria-label="Offers">
      <AnimatePresence mode="wait">
        <motion.p key={i} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.4 }}>{OFFERS[i]}</motion.p>
      </AnimatePresence>
    </div>
  );
}

// Same structure as the original site's "Our Products" menu
function MegaMenu({ onClose }) {
  return (
    <motion.div className="mega" initial={{ opacity: 0, y: -10, rotateX: -8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: [0.2, 0.7, 0.1, 1] }}>
      <div className="mega-inner mega-collections section-container">
        {CATEGORIES.map((c) => (
          <div key={c.id}>
            <h4><Link to={`/shop/${c.id}`} onClick={onClose}>{c.name}</Link></h4>
            {c.types.map((t) => <Link key={t.id} to={`/shop/${c.id}?type=${t.id}`} onClick={onClose}>{t.name}</Link>)}
          </div>
        ))}
        <Link to="/shop" onClick={onClose} className="mega-feature">
          <SafeImage id="/site/slide-1.webp" alt="" widths={[600, 900]} sizes="280px" position="70% center" />
          <span><small>All collections</small>View all jewellery</span>
        </Link>
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const { totals, wishlist, setCartOpen, setSearchOpen, user } = useStore();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  const { scrollY } = useScroll();
  useLockScroll(open);

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 40);
    setHidden(value > last.current && value > 500 && !open && !mega);
    last.current = value;
  });

  useEffect(() => { setOpen(false); setMega(false); }, [pathname]);

  const overlay = pathname === "/" && !scrolled && !mega;

  return (
    <>
      <motion.header className={`navbar-shell ${scrolled ? "is-scrolled" : ""} ${overlay ? "is-overlay" : ""}`} animate={{ y: hidden ? "-110%" : 0 }} transition={{ duration: 0.45, ease: [0.2, 0.7, 0.1, 1] }} onMouseLeave={() => setMega(false)}>
        <AnnouncementBar />
        <nav className="navbar section-container" aria-label="Main">
          <Link className="brand" to="/" aria-label="Rajani Jewels home">
            <img className="brand-logo" src="/logo.webp" alt="Rajani Jewels" width="328" height="110" />
          </Link>

          <div className="nav-links">
            <button className={`nav-link ${mega ? "is-open" : ""}`} aria-expanded={mega} onMouseEnter={() => setMega(true)} onClick={() => setMega((m) => !m)}>
              <span>Our Products</span> <ChevronDown size={14} />
            </button>
            {LINKS.map((link) => <NavLink key={link.label} to={link.to} className="nav-link" onMouseEnter={() => setMega(false)}><span>{link.label}</span></NavLink>)}
          </div>

          <div className="nav-actions">
            <button className="icon-button" aria-label="Search" onClick={() => setSearchOpen(true)}><Search size={19} /></button>
            <Link className="icon-button hide-sm" to="/account" aria-label={user ? `Account, ${user.name}` : "Sign in"}><User size={19} /></Link>
            <Link className="icon-button" to="/wishlist" aria-label={`Wishlist, ${wishlist.length} saved`}>
              <Heart size={19} />
              {wishlist.length > 0 && <span className="count-badge">{wishlist.length}</span>}
            </Link>
            <button className="icon-button" aria-label={`Enquiry list, ${totals.count} items`} onClick={() => setCartOpen(true)}>
              <ClipboardList size={19} />
              {totals.count > 0 && (
                <motion.span key={totals.count} className="count-badge" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>{totals.count}</motion.span>
              )}
            </button>
            <button className="icon-button menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </nav>
        <AnimatePresence>{mega && <MegaMenu onClose={() => setMega(false)} />}</AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ clipPath: "circle(0% at 92% 4%)" }} animate={{ clipPath: "circle(150% at 92% 4%)" }} exit={{ clipPath: "circle(0% at 92% 4%)" }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}>
            <div className="mobile-menu-links">
              {[{ label: "All jewellery", to: "/shop" }, ...CATEGORIES.map((c) => ({ label: c.name, to: `/shop/${c.id}` })), ...LINKS, { label: user ? "My account" : "Sign in", to: "/account" }].map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05, duration: 0.6, ease: [0.2, 0.7, 0.1, 1] }}>
                  <Link to={link.to} onClick={() => setOpen(false)}>{link.label}</Link>
                </motion.div>
              ))}
            </div>
            <p className="mobile-menu-note"><a href={`tel:${COMPANY.tel}`}>{COMPANY.phone}</a> · {COMPANY.email}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
