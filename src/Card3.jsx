// src/components/ui/card.jsx
export function Card3({ children, className = "", style = {} }) {
  return (
    <div className={`bg-white rounded-xl ${className}`} style={style}>
      {children}
    </div>
  );
}

export function CardContent3({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
