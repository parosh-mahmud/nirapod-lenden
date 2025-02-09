export function Button({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-button-primary hover:bg-button-hover text-white rounded ${className}`}
    >
      {children}
    </button>
  );
}
