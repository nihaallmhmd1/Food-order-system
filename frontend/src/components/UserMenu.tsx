import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface UserMenuProps {
  variant?: "light" | "dark";
}

export default function UserMenu({ variant = "light" }: UserMenuProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        onClick={() => navigate("/login")}
        className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-emerald-600 active:scale-95"
      >
        Login
      </button>
    );
  }

  const displayName = user.name || (user.email ? user.email.split("@")[0] : "User");
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const iconClasses =
    variant === "dark"
      ? "bg-gray-100 text-emerald-800 hover:bg-emerald-100"
      : "bg-stone-100 text-stone-700 hover:bg-emerald-100 hover:text-emerald-700";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Account menu"
        aria-expanded={open}
        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${iconClasses}`}
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-bold text-gray-900">{displayName}</p>
            {user.email && (
              <p className="truncate text-xs text-gray-500">{user.email}</p>
            )}
          </div>
          {(() => {
            const roleName =
              typeof user.role === "object" ? user.role.name : user.role;
            const hasPortalAccess =
              roleName === "admin" ||
              (roleName === "restaurantadmin" &&
                Boolean(user.restaurantId) &&
                (user.role instanceof Object
                  ? (user.role.permissions?.length || 0) > 0
                  : false));

            return hasPortalAccess ? (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                Admin Portal
              </Link>
            ) : null;
          })()}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            🚪 Sign out
          </button>
        </div>
      )}
    </div>
  );
}
