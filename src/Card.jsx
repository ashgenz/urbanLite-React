// src/components/ui/card.jsx
export function Card({ children, className = "", style = {} }) {
  return (
    <div className={`bg-white rounded-xl shadow-md ${className}`} style={style}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
