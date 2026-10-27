import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, TrendingUp, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SafeImage from "./SafeImage.jsx";
import { useEscape, useLockScroll } from "./Modal.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { CATEGORIES, POPULAR_SEARCHES, searchProducts } from "../data/catalog.js";

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const close = useCallback(() => setSearchOpen(false), [setSearchOpen]);
  useLockScroll(searchOpen);
  useEscape(searchOpen, close);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 80);
    else setQuery("");
  }, [searchOpen]);

  const results = searchProducts(query).slice(0, 6);

  const submit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    close();
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  return createPortal(
    <AnimatePresence>
      {searchOpen && (
        <motion.div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="search-panel" initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ duration: 0.45, ease: [0.2, 0.7, 0.1, 1] }}>
            <form className="search-form" onSubmit={submit}>
              <Search size={22} />
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search polki, bangles, rings, RJ code…" aria-label="Search products" />
              <button type="button" className="icon-button" aria-label="Close search" onClick={close}><X size={20} /></button>
            </form>

            {query.trim() ? (
              <div className="search-results">
                {results.length ? (
                  <>
                    {results.map((p) => (
                      <Link key={p.id} to={`/product/${p.id}`} onClick={close} className="search-hit">
                        <span className="search-thumb"><SafeImage id={p.images[0]} alt="" widths={[120, 160]} sizes="56px" /></span>
                        <span><strong>{p.name}</strong><small>{p.typeName} · {p.metal}</small></span>
                        <em>{p.code}</em>
                      </Link>
                    ))}
                    <button className="text-link" onClick={submit}>See all results for “{query}” <ArrowRight size={15} /></button>
                  </>
                ) : (
                  <p className="muted">No pieces match “{query}”. Try a category below.</p>
                )}
              </div>
            ) : (
              <div className="search-suggest">
                <div>
                  <h4><TrendingUp size={15} /> Popular searches</h4>
                  <div className="chip-row">
                    {POPULAR_SEARCHES.map((s) => <button key={s} className="chip" onClick={() => setQuery(s)}>{s}</button>)}
                  </div>
                </div>
                <div>
                  <h4>Categories</h4>
                  <div className="chip-row">
                    {CATEGORIES.map((c) => <Link key={c.id} className="chip" to={`/shop/${c.id}`} onClick={close}>{c.name}</Link>)}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
          <div className="search-backdrop" onClick={close} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
