import "./Button.css";

const VARIANTS = ["primary", "secondary", "inverted", "outlined"];

export default function Button({
  children,
  variant = "primary",
  as = "button",
  href,
  onClick,
  type = "button",
  className = "",
  ...rest
}) {
  const variantClass = VARIANTS.includes(variant) ? variant : "primary";
  const classes = `btn btn--${variantClass} ${className}`.trim();

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
