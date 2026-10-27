import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Button from "../components/Button.jsx";
import { useLockScroll } from "../components/Modal.jsx";
import { useTitle } from "../components/FloatingActions.jsx";
import { CATEGORIES, COLORS, OCCASIONS, PRODUCTS, TYPES, searchProducts } from "../data/catalog.js";

const PAGE = 24;

const FILTERS = [
  { key: "color", label: "Metal colour", options: Object.entries(COLORS).map(([id, c]) => [id, c.label]), test: (p, v) => v.some((c) => p.colors.includes(c)) },
  { key: "purity", label: "Purity", options: [["22K", "22K gold"], ["18K", "18K gold"]], test: (p, v) => v.includes(p.purity) },
  { key: "stone", label: "Stone", options: [["diamond", "Diamond"], ["gemstone", "Gemstone"], ["pearl", "Pearl"], ["plain", "Plain gold"]], test: (p, v) => v.includes(p.stoneKind) },
  { key: "occasion", label: "Occasion", options: OCCASIONS.map((o) => [o.id, o.name]), test: (p, v) => v.some((o) => p.occasions.includes(o)) },
];

const SORTS = {
  new: { label: "Newest first", fn: (a, b) => a.order - b.order },
  old: { label: "Oldest first", fn: (a, b) => b.order - a.order },
  name: { label: "Name A–Z", fn: (a, b) => a.name.localeCompare(b.name) },
};

export default function Shop() {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const [panel, setPanel] = useState(false);
  const [shown, setShown] = useState(PAGE);
  useLockScroll(panel);

  const cat = CATEGORIES.find((c) => c.id === category);
  const q = params.get("q") || "";
  const type = TYPES[params.get("type")] ? params.get("type") : "";
  const sort = SORTS[params.get("sort")] ? params.get("sort") : "new";
  const values = (key) => params.get(key)?.split(",").filter(Boolean) || [];

  const toggle = (key, value) => {
    const next = new URLSearchParams(params);
    const cur = values(key);
    const list = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
    list.length ? next.set(key, list.join(",")) : next.delete(key);
    setParams(next, { replace: true });
  };
  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next, { replace: true });
  };
  const clearAll = () => setParams(q ? { q } : {}, { replace: true });

  const results = useMemo(() => {
    let list = q ? searchProducts(q) : PRODUCTS;
    if (cat) list = list.filter((p) => p.category === cat.id);
    if (type) list = list.filter((p) => p.type === type);
    for (const f of FILTERS) {
      const v = values(f.key);
      if (v.length) list = list.filter((p) => f.test(p, v));
    }
    return [...list].sort(SORTS[sort].fn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, cat, q, sort, type]);
  useEffect(() => { setShown(PAGE); }, [results]);

  const active = FILTERS.flatMap((f) => values(f.key).map((v) => ({ key: f.key, value: v, label: f.options.find((o) => o[0] === v)?.[1] || v })));
  const title = q ? `Results for “${q}”` : type ? TYPES[type].name : cat ? cat.name : "Our Products";
  useTitle(q ? `Search: ${q}` : type ? TYPES[type].name : cat ? cat.name : "Our Products");

  const typeLink = (c, t) => {
    const next = new URLSearchParams(params);
    t ? next.set("type", t) : next.delete("type");
    const qs = next.toString();
    return `/shop${c ? `/${c}` : ""}${qs ? `?${qs}` : ""}`;
  };

  const filterPanel = (
    <div className="filters">
      <div className="filter-group">
        <h4>Collection</h4>
        <Link to={typeLink("", "")} className={`filter-link ${!cat ? "is-active" : ""}`}>All jewellery <small>{PRODUCTS.length}</small></Link>
        {CATEGORIES.map((c) => (
          <div key={c.id}>
            <Link to={typeLink(c.id, "")} className={`filter-link ${cat?.id === c.id && !type ? "is-active" : ""}`}>
              {c.name} <small>{PRODUCTS.filter((p) => p.category === c.id).length}</small>
            </Link>
            {cat?.id === c.id && c.types.filter((t) => t.count).map((t) => (
              <Link key={t.id} to={typeLink(c.id, t.id)} className={`filter-link is-sub ${type === t.id ? "is-active" : ""}`}>
                {t.name} <small>{t.count}</small>
              </Link>
            ))}
          </div>
        ))}
      </div>
      {FILTERS.map((f) => (
        <div className="filter-group" key={f.key}>
          <h4>{f.label}</h4>
          {f.options.map(([value, label]) => (
            <label key={value} className="check">
              <input type="checkbox" checked={values(f.key).includes(value)} onChange={() => toggle(f.key, value)} />
              <span className="check-box" />
              {label}
            </label>
          ))}
        </div>
      ))}
    </div>
  );

  const crumbs = [{ label: "Our Products", to: "/shop" }];
  if (cat) crumbs.push({ label: cat.name, to: type ? `/shop/${cat.id}` : undefined });
  if (type) crumbs.push({ label: TYPES[type].name });

  return (
    <>
      <PageHeader title={title} sub={cat?.blurb || "Handcrafted gold, Polki, diamond & gemstone jewellery — made in Surat, crafted for the world."} crumbs={crumbs.length > 1 ? crumbs : [{ label: "Our Products" }]} />

      <div className="section-container shop">
        <aside className="shop-side" aria-label="Filters">{filterPanel}</aside>

        <div className="shop-main">
          <div className="shop-bar">
            <button className="btn btn-line filter-toggle" onClick={() => setPanel(true)}>
              <span className="btn-label"><SlidersHorizontal size={16} /> Filters {active.length > 0 && `(${active.length})`}</span>
            </button>
            <p className="muted"><strong>{results.length}</strong> {results.length === 1 ? "piece" : "pieces"}</p>
            <label className="sort">
              <span>Sort</span>
              <select value={sort} onChange={(e) => setParam("sort", e.target.value === "new" ? "" : e.target.value)}>
                {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
              </select>
            </label>
          </div>

          {(active.length > 0 || q || type) && (
            <div className="active-filters">
              {q && <button className="chip is-active" onClick={() => setParam("q", "")}>“{q}” <X size={13} /></button>}
              {type && <button className="chip is-active" onClick={() => setParam("type", "")}>{TYPES[type].name} <X size={13} /></button>}
              {active.map((a) => <button key={a.key + a.value} className="chip is-active" onClick={() => toggle(a.key, a.value)}>{a.label} <X size={13} /></button>)}
              <button className="link-btn" onClick={clearAll}>Clear all</button>
            </div>
          )}

          {results.length ? (
            <>
              <motion.div className="product-grid is-shop" layout>
                <AnimatePresence mode="popLayout">
                  {results.slice(0, shown).map((p) => (
                    <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.35 }}>
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              {shown < results.length && (
                <div className="center-row">
                  <Button variant="dark" onClick={() => setShown((n) => n + PAGE)}>Load more ({results.length - shown} more)</Button>
                </div>
              )}
            </>
          ) : (
            <div className="empty">
              <h3>No pieces match these filters</h3>
              <p className="muted">Try removing a filter or browse everything.</p>
              <Button variant="gold" onClick={clearAll}>Clear filters</Button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {panel && (
          <>
            <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPanel(false)} />
            <motion.aside className="drawer is-left" role="dialog" aria-modal="true" aria-label="Filters" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}>
              <header className="drawer-head"><h2>Filters</h2><button className="icon-button" aria-label="Close filters" onClick={() => setPanel(false)}><X size={20} /></button></header>
              <div className="drawer-scroll">{filterPanel}</div>
              <footer className="drawer-foot drawer-buttons">
                <Button variant="line" onClick={clearAll}>Clear</Button>
                <Button variant="gold" onClick={() => setPanel(false)}>Show {results.length}</Button>
              </footer>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
