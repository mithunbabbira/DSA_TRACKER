export function Card({ title, action, children, className = '', highlight = false }) {
  return (
    <div
      className={`rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
        highlight ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-200'
      } ${className}`}
    >
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && (
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">{title}</h2>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Badge({ category }) {
  const styles = {
    DSA: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    LLD: 'bg-blue-50 text-blue-700 border-blue-200',
    HLD: 'bg-purple-50 text-purple-700 border-purple-200',
  };
  return (
    <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${styles[category] || ''}`}>
      {category}
    </span>
  );
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
    ghost: 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
  };
  return (
    <button
      type="button"
      className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 ${className}`}
      {...props}
    />
  );
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
