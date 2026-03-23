import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

interface User {
  name: string;
  oiv: string;
  phone: string;
  role: "admin" | "user";
}

interface ProfilePageProps {
  user: User | null;
}

const mockRequests = [
  { id: "2024-001", system: "ЕПГУ", topic: "Ошибка при входе в систему", date: "22.03.2026", status: "В работе" },
  { id: "2024-002", system: "СМЭВ", topic: "Настройка интеграции", date: "20.03.2026", status: "Закрыта" },
  { id: "2024-003", system: "ГИС ЖКХ", topic: "Вопрос по заполнению форм", date: "15.03.2026", status: "Закрыта" },
];

const statusColor: Record<string, string> = {
  "В работе": "bg-amber-100 text-amber-700",
  "Закрыта": "bg-green-100 text-green-700",
  "Новая": "bg-blue-100 text-blue-700",
};

export default function ProfilePage({ user }: ProfilePageProps) {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Lock" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-lg font-semibold mb-2">Требуется авторизация</h2>
          <p className="text-sm text-muted-foreground mb-4">Войдите в систему для доступа к личному кабинету</p>
          <button onClick={() => navigate("/")} className="text-gov-accent hover:underline text-sm">
            На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold text-foreground mb-6">Личный кабинет</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="bg-white border border-border rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gov-navy rounded-full flex items-center justify-center">
                  <Icon name="User" size={24} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{user.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {user.role === "admin" ? "Администратор" : "Пользователь"}
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs mb-0.5">Организация</div>
                  <div className="text-foreground leading-tight">{user.oiv}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs mb-0.5">Телефон</div>
                  <div className="text-foreground">{user.phone}</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-lg p-5">
              <h3 className="font-medium text-foreground mb-3">Настройки уведомлений</h3>
              <div className="space-y-3 text-sm">
                <label className="flex items-center justify-between">
                  <span>Email-уведомления</span>
                  <input type="checkbox" defaultChecked className="accent-gov-navy" />
                </label>
                <label className="flex items-center justify-between">
                  <span>SMS-уведомления</span>
                  <input type="checkbox" className="accent-gov-navy" />
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white border border-border rounded-lg">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-medium text-foreground">Мои заявки в техподдержку</h3>
              </div>
              <div className="divide-y divide-border">
                {mockRequests.map((req) => (
                  <div key={req.id} className="px-5 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono">#{req.id}</span>
                        <span className="text-xs bg-gov-light text-gov-navy px-2 py-0.5 rounded">{req.system}</span>
                      </div>
                      <div className="font-medium text-sm text-foreground mt-1">{req.topic}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{req.date}</div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[req.status] || "bg-muted text-muted-foreground"}`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
