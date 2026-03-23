import { useNavigate } from "react-router-dom";
import { oivList } from "@/data/oiv";
import Icon from "@/components/ui/icon";

interface User {
  name: string;
  oiv: string;
  phone: string;
  role: "admin" | "user";
}

interface AdminPageProps {
  user: User | null;
}

export default function AdminPage({ user }: AdminPageProps) {
  const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Icon name="ShieldAlert" size={48} className="mx-auto mb-4 text-destructive opacity-60" />
          <h2 className="text-lg font-semibold mb-2">Доступ запрещён</h2>
          <p className="text-sm text-muted-foreground mb-4">Страница доступна только администраторам</p>
          <button onClick={() => navigate("/")} className="text-gov-accent hover:underline text-sm">
            На главную
          </button>
        </div>
      </div>
    );
  }

  const totalSystems = oivList.reduce((sum, o) => sum + o.systems.length, 0);

  return (
    <div className="flex-1 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Панель администратора</h1>
            <p className="text-sm text-muted-foreground mt-1">Управление контентом портала</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full">
            <Icon name="ShieldCheck" size={14} />
            Администратор
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Органов власти", value: oivList.length, icon: "Building2" },
            { label: "Информационных систем", value: totalSystems, icon: "Monitor" },
            { label: "Обращений в поддержку", value: 3, icon: "MessageSquare" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-border rounded-lg p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-gov-light rounded-lg flex items-center justify-center">
                <Icon name={stat.icon} size={22} className="text-gov-navy" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gov-navy">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-border rounded-lg">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-medium text-foreground">Управление информационными системами</h3>
            <span className="text-xs text-muted-foreground">
              Нажмите на систему для редактирования контента
            </span>
          </div>
          <div className="divide-y divide-border">
            {oivList.map((oiv) => (
              <div key={oiv.id}>
                <div className="px-5 py-3 bg-muted/30">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {oiv.shortName}
                  </div>
                </div>
                {oiv.systems.map((system) => (
                  <div
                    key={system.id}
                    className="px-5 py-3.5 flex items-center justify-between hover:bg-muted/20 cursor-pointer"
                    onClick={() => navigate(`/system/${system.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gov-light rounded flex items-center justify-center">
                        <Icon name="Monitor" size={14} className="text-gov-navy" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{system.shortName}</div>
                        <div className="text-xs text-muted-foreground">{system.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {Object.entries(system.tabs).filter(([, v]) => v).map(([k]) => (
                          <span key={k} className="text-[10px] bg-gov-light text-gov-navy px-1.5 py-0.5 rounded">
                            {k === "description" ? "Описание" : k === "instructions" ? "Инструкции" : k === "npa" ? "НПА" : k === "asuz" ? "АСУЗ" : k === "website" ? "Сайт" : "Вебинары"}
                          </span>
                        ))}
                      </div>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
