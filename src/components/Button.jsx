import { Link } from "react-router-dom";
import Magnetic from "./Magnetic.jsx";

// variant: "gold" | "ghost" | "dark" | "line"   ·   pass `to` for an internal route
export default function Button({ as, to, variant = "gold", icon = null, magnetic = false, className = "", children, ...props }) {
  const Tag = to ? Link : as || "button";
  const button = (
    <Tag className={`btn btn-${variant} ${className}`} to={to} {...props}>
      <span className="btn-label">{children}</span>
      {icon && <span className="btn-icon">{icon}</span>}
    </Tag>
  );
  return magnetic ? <Magnetic>{button}</Magnetic> : button;
}
