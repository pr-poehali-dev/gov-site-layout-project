import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";

interface User {
  name: string;
  oiv: string;
  phone: string;
  role: "admin" | "user";
}

interface HeaderProps {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

export default function Header({ user, onLogin, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loginForm, setLoginForm] = useState({ login: "", password: "" });

  const navItems = [
    { label: "Главная", path: "/" },
    { label: "Каталог ИС", path: "/catalog" },
    { label: "Техподдержка", path: "/support" },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.login === "admin" && loginForm.password === "admin") {
      onLogin({
        name: "Иванов Иван Иванович",
        oiv: "Министерство государственного управления, информационных технологий и связи Краснодарского края",
        phone: "+7 (861) 000-00-00",
        role: "admin",
      });
    } else {
      onLogin({
        name: "Петрова Мария Сергеевна",
        oiv: "Министерство финансов Краснодарского края",
        phone: "+7 (861) 111-11-11",
        role: "user",
      });
    }
    setShowLoginModal(false);
    setLoginForm({ login: "", password: "" });
  };

  return (
    <>
      <header className="bg-gov-navy text-white shadow-lg">
        <div className="border-b border-white/10 py-1.5 px-6">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between text-xs text-white/60">
            <span>Краснодарский край</span>
            <span>Официальный портал органов государственной власти</span>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="max-w-[1400px] mx-auto flex items-center gap-4">
            <div
              className="flex items-center gap-3 cursor-pointer flex-1"
              onClick={() => navigate("/")}
            >
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center flex-shrink-0">
                <div className="text-gov-navy font-bold text-lg leading-none text-center">
                  <div className="text-[10px] font-bold text-gov-blue">КК</div>
                </div>
              </div>
              <div>
                <div className="font-semibold text-base leading-tight">
                  Единый портал информационных систем
                </div>
                <div className="text-xs text-white/60 mt-0.5">
                  Краснодарского края
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-4 py-2 text-sm rounded transition-colors ${
                    location.pathname === item.path
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className={`px-4 py-2 text-sm rounded transition-colors ${
                    location.pathname === "/admin"
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Администрирование
                </button>
              )}
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
                  >
                    <div className="w-7 h-7 bg-gov-accent rounded-full flex items-center justify-center">
                      <Icon name="User" size={14} />
                    </div>
                    <span className="text-sm hidden md:block max-w-[160px] truncate">
                      {user.name.split(" ")[0]} {user.name.split(" ")[1]}
                    </span>
                    <Icon name="ChevronDown" size={14} />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded shadow-xl border border-border z-50 animate-scale-in">
                      <div className="px-4 py-3 border-b border-border">
                        <div className="font-medium text-sm text-foreground truncate">{user.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {user.role === "admin" ? "Администратор" : "Пользователь"}
                        </div>
                      </div>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted flex items-center gap-2 text-foreground"
                        onClick={() => { navigate("/profile"); setShowUserMenu(false); }}
                      >
                        <Icon name="UserCircle" size={16} />
                        Личный кабинет
                      </button>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted flex items-center gap-2 text-destructive"
                        onClick={() => { onLogout(); setShowUserMenu(false); }}
                      >
                        <Icon name="LogOut" size={16} />
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gov-accent hover:bg-blue-500 rounded text-sm font-medium transition-colors"
                >
                  <Icon name="LogIn" size={16} />
                  Войти
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showLoginModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowLoginModal(false)}
        >
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm animate-scale-in">
            <div className="px-6 pt-6 pb-4 border-b border-border">
              <h2 className="font-semibold text-lg text-foreground">Вход в систему</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Введите учётные данные для авторизации
              </p>
            </div>
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Логин
                </label>
                <input
                  type="text"
                  value={loginForm.login}
                  onChange={(e) => setLoginForm({ ...loginForm, login: e.target.value })}
                  className="w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Введите логин"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Пароль
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Введите пароль"
                />
              </div>
              <div className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded">
                Подсказка: логин <strong>admin</strong> / пароль <strong>admin</strong> — для входа как администратор
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded text-sm hover:bg-muted transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gov-navy text-white rounded text-sm hover:bg-gov-blue transition-colors font-medium"
                >
                  Войти
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
