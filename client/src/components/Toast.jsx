import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-600 text-white',
  };

  return (
    <div
      className={`fixed bottom-20 left-1/2 z-50 -translate-x-1/2 animate-slide-in rounded-xl px-4 py-3 text-sm font-medium shadow-lg sm:bottom-6 ${styles[type]}`}
      role="status"
    >
      {message}
    </div>
  );
}
