'use client';

interface ClienteNavbarProps {
  appName?: string;
  appIcon?: string;
  onHelp?: () => void;
  onProfile?: () => void;
}

export default function ClienteNavbar({
  appName = 'Formix',
  appIcon = 'F',
  onHelp,
  onProfile,
}: ClienteNavbarProps) {
  return (
    <nav className="border-b border-gray-800 bg-gray-900 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">{appIcon}</span>
          </div>
          <div>
            <p className="font-semibold text-gray-100">{appName}</p>
            <p className="text-xs text-gray-400">Cliente Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onHelp}
            className="text-gray-400 hover:text-gray-200 text-sm transition"
          >
            ? Ayuda
          </button>
          <button
            onClick={onProfile}
            className="text-gray-400 hover:text-gray-200 text-lg transition"
          >
            👤
          </button>
        </div>
      </div>
    </nav>
  );
}