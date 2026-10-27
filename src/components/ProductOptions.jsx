import { useEffect, useState } from "react";
import { Ruler } from "lucide-react";
import Modal from "./Modal.jsx";
import { BRACELET_SIZES, RING_SIZES, RING_SIZE_TABLE } from "../data/catalog.js";

// Size is optional on an enquiry — the team confirms it on the call
export function useProductOptions(product) {
  const [size, setSize] = useState("");
  useEffect(() => { setSize(""); }, [product]);
  return { size, setSize: (s) => setSize((cur) => (cur === s ? "" : s)) };
}

export default function ProductOptions({ product, opts }) {
  const [guide, setGuide] = useState(false);
  const sizes = product.sizeType === "ring" ? RING_SIZES : product.sizeType === "bracelet" ? BRACELET_SIZES : null;
  if (!sizes) return null;

  return (
    <div className="options">
      <fieldset className="option-group">
        <legend>
          {product.sizeType === "ring" ? "Ring size (Indian, optional)" : "Size in inches (optional)"}
          <button type="button" className="link-btn" onClick={() => setGuide(true)}><Ruler size={14} /> Size guide</button>
        </legend>
        <div className="chip-row">
          {sizes.map((s) => (
            <button key={s} type="button" className={`chip chip-sm ${opts.size === String(s) ? "is-active" : ""}`} aria-pressed={opts.size === String(s)} onClick={() => opts.setSize(String(s))}>{s}</button>
          ))}
        </div>
      </fieldset>
      <SizeGuide open={guide} onClose={() => setGuide(false)} />
    </div>
  );
}

export function SizeGuide({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Find your size">
      <div className="size-guide">
        <h3>Ring sizes</h3>
        <p>Wrap a strip of paper around the base of your finger, mark where it overlaps and measure the length in mm. Divide by 3.14 to get the inner diameter, then match it below.</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Indian size</th><th>Inner diameter</th><th>US size</th></tr></thead>
            <tbody>
              {RING_SIZE_TABLE.map((r) => <tr key={r.in}><td>{r.in}</td><td>{r.mm} mm</td><td>{r.us}</td></tr>)}
            </tbody>
          </table>
        </div>
        <h3>Bangle & bracelet sizes</h3>
        <p>2.4" fits a slim wrist (up to 14.5 cm), 2.6" a medium wrist (up to 16 cm) and 2.8" a larger wrist (up to 17.5 cm).</p>
        <p className="muted">Not sure? Leave it blank — our team will help you find the right size.</p>
      </div>
    </Modal>
  );
}
