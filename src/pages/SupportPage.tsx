import { useState } from "react";
import Icon from "@/components/ui/icon";
import { oivList } from "@/data/oiv";

interface User {
  name: string;
  oiv: string;
  phone: string;
  role: "admin" | "user";
}

interface SupportPageProps {
  user: User | null;
}

export default function SupportPage({ user }: SupportPageProps) {
  const [form, setForm] = useState({
    fio: user?.name || "",
    oiv: user?.oiv || "",
    oivOther: "",
    showOther: false,
    email: "",
    phone: user?.phone || "",
    topic: "",
    description: "",
  });
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const oivNames = oivList.map((o) => o.name);

  if (sent) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center p-6">
        <div className="bg-white border border-border rounded-lg p-10 text-center max-w-md w-full animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-green-600" />
          </div>
          <h3 className="font-semibold text-xl mb-2">Обращение принято</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Ваше обращение зарегистрировано. Уведомления о статусе будут направлены{" "}
            {notifyEmail && notifySms ? "на почту и по SMS" : notifyEmail ? "на почту" : "по SMS"}.
          </p>
          <button
            onClick={() => setSent(false)}
            className="px-6 py-2.5 bg-gov-navy text-white rounded text-sm font-medium hover:bg-gov-blue transition-colors"
          >
            Новое обращение
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">Техническая поддержка и обратная связь</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Направьте обращение специалистам технической поддержки
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white border border-border rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    ФИО <span className="text-destructive">*</span>
                  </label>
                  <input
                    required
                    value={form.fio}
                    onChange={(e) => setForm({ ...form, fio: e.target.value })}
                    readOnly={!!user}
                    className={`w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${user ? "bg-muted cursor-not-allowed" : ""}`}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    ОИВ / Учреждение <span className="text-destructive">*</span>
                  </label>
                  {user ? (
                    <input value={form.oiv} readOnly className="w-full border border-input rounded px-3 py-2 text-sm bg-muted cursor-not-allowed" />
                  ) : (
                    <>
                      <select
                        required={!form.showOther}
                        value={form.showOther ? "other" : form.oiv}
                        onChange={(e) => {
                          if (e.target.value === "other") setForm({ ...form, showOther: true, oiv: "other" });
                          else setForm({ ...form, showOther: false, oiv: e.target.value, oivOther: "" });
                        }}
                        className="w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                      >
                        <option value="">— Выберите орган власти —</option>
                        {oivNames.map((n) => <option key={n} value={n}>{n}</option>)}
                        <option value="other">Другое</option>
                      </select>
                      {form.showOther && (
                        <input
                          required
                          value={form.oivOther}
                          onChange={(e) => setForm({ ...form, oivOther: e.target.value })}
                          className="w-full border border-input rounded px-3 py-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Введите наименование организации"
                        />
                      )}
                    </>
                  )}
                </div>

                {!user && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Почта для обратной связи <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="example@mail.ru"
                    />
                  </div>
                )}

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Телефон</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    readOnly={!!user}
                    className={`w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${user ? "bg-muted cursor-not-allowed" : ""}`}
                    placeholder="+7 (000) 000-00-00"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Тема <span className="text-destructive">*</span>
                  </label>
                  <input
                    required
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Кратко опишите суть обращения"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Описание <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Подробно опишите проблему или вопрос..."
                  />
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="text-sm font-medium mb-2">Уведомления о статусе:</div>
                <div className="flex gap-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} className="accent-gov-navy" />
                    <span className="text-sm">Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={notifySms} onChange={(e) => setNotifySms(e.target.checked)} className="accent-gov-navy" />
                    <span className="text-sm">SMS</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" className="px-6 py-2.5 bg-gov-navy text-white rounded text-sm font-medium hover:bg-gov-blue transition-colors">
                  Отправить обращение
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-border rounded-lg p-5">
              <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Icon name="Phone" size={16} className="text-gov-accent" />
                Контакты поддержки
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Телефон горячей линии:</div>
                <div className="font-medium text-foreground">8-800-000-00-00</div>
                <div className="text-xs">(звонок бесплатный)</div>
              </div>
            </div>
            <div className="bg-white border border-border rounded-lg p-5">
              <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Icon name="Clock" size={16} className="text-gov-accent" />
                Режим работы
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Пн–Пт: 9:00 — 18:00</div>
                <div>Сб–Вс: выходной</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
