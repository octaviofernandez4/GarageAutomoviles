import { Link } from "react-router-dom";
import "./Button.css";

const VARIANTS = ["copper", "bone", "outline"];

export default function Button({
  children,
  variant = "copper",
  as = "button",
  href,
  to,
  onClick,
  type = "button",
  className = "",
  ...rest
}) {
  const variantClass = VARIANTS.includes(variant) ? variant : "copper";
  const classes = `btn btn--${variantClass} ${className}`.trim();

  if (as === "link" || to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  if (as === "a" || href) {
    return (
      <a href={href} className={classes} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
