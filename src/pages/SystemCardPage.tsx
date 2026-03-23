import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSystemById } from "@/data/oiv";
import { oivList } from "@/data/oiv";
import Icon from "@/components/ui/icon";

interface User {
  name: string;
  oiv: string;
  phone: string;
  role: "admin" | "user";
}

interface SystemCardPageProps {
  user: User | null;
}

type TabKey = "description" | "instructions" | "npa" | "asuz" | "website" | "webinars";

const TAB_LABELS: Record<TabKey, string> = {
  description: "Описание",
  instructions: "Инструкции",
  npa: "НПА",
  asuz: "АСУЗ",
  website: "Сайт ИС",
  webinars: "Вебинары",
};

const TAB_ICONS: Record<TabKey, string> = {
  description: "FileText",
  instructions: "BookOpen",
  npa: "Scale",
  asuz: "HeadphonesIcon",
  website: "Globe",
  webinars: "Video",
};

interface RequestFormTile {
  id: string;
  name: string;
  fileType: "docx" | "xls" | "pdf";
  fileName: string;
}

const FILE_TYPE_ICONS: Record<RequestFormTile["fileType"], string> = {
  docx: "FileText",
  xls: "FileSpreadsheet",
  pdf: "FileImage",
};

const FILE_TYPE_COLORS: Record<RequestFormTile["fileType"], string> = {
  docx: "text-blue-600 bg-blue-50",
  xls: "text-green-600 bg-green-50",
  pdf: "text-red-600 bg-red-50",
};

const INITIAL_TILES: Record<string, RequestFormTile[]> = {
  epgu: [
    {
      id: "epgu-1",
      name: "форма заявки для учётных записей",
      fileType: "docx",
      fileName: "zayavka_uchetnye_zapisi.docx",
    },
  ],
};

export default function SystemCardPage({ user }: SystemCardPageProps) {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const result = systemId ? getSystemById(systemId) : null;

  const [activeTab, setActiveTab] = useState<TabKey>("description");
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState({
    description: result?.system.descriptionContent || "",
    instructions: result?.system.instructionsContent || "",
    npa: result?.system.npaContent || "",
  });

  const [requestTiles, setRequestTiles] = useState<Record<string, RequestFormTile[]>>(INITIAL_TILES);
  const [showAddTileModal, setShowAddTileModal] = useState(false);
  const [newTile, setNewTile] = useState<{ name: string; fileType: RequestFormTile["fileType"]; fileName: string }>({
    name: "",
    fileType: "docx",
    fileName: "",
  });

  const currentTiles = systemId ? (requestTiles[systemId] || []) : [];

  const handleAddTile = () => {
    if (!systemId || !newTile.name.trim() || !newTile.fileName.trim()) return;
    const tile: RequestFormTile = {
      id: `${systemId}-${Date.now()}`,
      name: newTile.name.trim(),
      fileType: newTile.fileType,
      fileName: newTile.fileName.trim(),
    };
    setRequestTiles((prev) => ({
      ...prev,
      [systemId]: [...(prev[systemId] || []), tile],
    }));
    setNewTile({ name: "", fileType: "docx", fileName: "" });
    setShowAddTileModal(false);
  };

  const handleRemoveTile = (tileId: string) => {
    if (!systemId) return;
    setRequestTiles((prev) => ({
      ...prev,
      [systemId]: (prev[systemId] || []).filter((t) => t.id !== tileId),
    }));
  };

  const [asuzForm, setAsuzForm] = useState({
    fio: user?.name || "",
    oiv: user?.oiv || "",
    oivOther: "",
    showOther: false,
    email: "",
    phone: user?.phone || "",
    topic: "",
    description: "",
  });
  const [asuzSent, setAsuzSent] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);

  if (!result) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold mb-2">Система не найдена</h2>
          <button
            onClick={() => navigate("/")}
            className="text-gov-accent hover:underline text-sm"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  const { system, oiv } = result;
  const enabledTabs = (Object.keys(system.tabs) as TabKey[]).filter((k) => system.tabs[k]);

  const handleAsuzSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAsuzSent(true);
  };

  const oivSelectList = oivList.map((o) => o.name);

  return (
    <div className="flex-1 bg-background">
      <div className="bg-gov-navy text-white">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-3 transition-colors"
          >
            <Icon name="ChevronLeft" size={16} />
            На главную
          </button>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Monitor" size={22} />
            </div>
            <div>
              <h1 className="font-semibold text-xl leading-tight">{system.name}</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/80">
                  {system.shortName}
                </span>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-xs text-white/60">{oiv.shortName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {enabledTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setEditMode(false); }}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "border-gov-accent text-gov-navy"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon name={TAB_ICONS[tab]} size={15} />
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {(activeTab === "description" || activeTab === "instructions" || activeTab === "npa") && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">{TAB_LABELS[activeTab]}</h2>
              {user?.role === "admin" && (
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded border transition-colors ${
                    editMode
                      ? "bg-gov-navy text-white border-gov-navy"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <Icon name={editMode ? "Save" : "Pencil"} size={14} />
                  {editMode ? "Сохранить" : "Редактировать"}
                </button>
              )}
            </div>
            {editMode && user?.role === "admin" ? (
              <textarea
                value={content[activeTab as "description" | "instructions" | "npa"]}
                onChange={(e) =>
                  setContent({ ...content, [activeTab]: e.target.value })
                }
                className="w-full h-64 border border-input rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                placeholder="Введите содержимое раздела..."
              />
            ) : (
              <div className="bg-white border border-border rounded-lg p-5 min-h-[200px]">
                {content[activeTab as "description" | "instructions" | "npa"] ? (
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {content[activeTab as "description" | "instructions" | "npa"]}
                  </p>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <Icon name="FileText" size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Содержимое раздела не добавлено</p>
                    {user?.role === "admin" && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="mt-2 text-gov-accent hover:underline text-xs"
                      >
                        Добавить содержимое
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "asuz" && (
          <>
          <div className="flex gap-6 items-start">
            <div className="flex-1 min-w-0 max-w-2xl">
            <div className="mb-5">
              <h2 className="font-semibold text-foreground">Заявка в службу технической поддержки</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Заполните форму, и специалист свяжется с вами в рабочее время
              </p>
            </div>

            {asuzSent ? (
              <div className="bg-white border border-border rounded-lg p-8 text-center animate-fade-in">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={28} className="text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Заявка отправлена</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ваша заявка зарегистрирована. Уведомления о статусе будут отправлены{" "}
                  {notifyEmail && notifySms
                    ? "на почту и SMS"
                    : notifyEmail
                    ? "на почту"
                    : notifySms
                    ? "по SMS"
                    : "в личный кабинет"}
                  .
                </p>
                <button
                  onClick={() => setAsuzSent(false)}
                  className="px-5 py-2 bg-gov-navy text-white rounded text-sm hover:bg-gov-blue transition-colors"
                >
                  Новая заявка
                </button>
              </div>
            ) : (
              <form onSubmit={handleAsuzSubmit} className="bg-white border border-border rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      ФИО <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={asuzForm.fio}
                      onChange={(e) => setAsuzForm({ ...asuzForm, fio: e.target.value })}
                      readOnly={!!user}
                      className={`w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                        user ? "bg-muted cursor-not-allowed" : ""
                      }`}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      ОИВ / Учреждение <span className="text-destructive">*</span>
                    </label>
                    {user ? (
                      <input
                        type="text"
                        value={asuzForm.oiv}
                        readOnly
                        className="w-full border border-input rounded px-3 py-2 text-sm bg-muted cursor-not-allowed"
                      />
                    ) : (
                      <>
                        <select
                          required={!asuzForm.showOther}
                          value={asuzForm.showOther ? "other" : asuzForm.oiv}
                          onChange={(e) => {
                            if (e.target.value === "other") {
                              setAsuzForm({ ...asuzForm, showOther: true, oiv: "other" });
                            } else {
                              setAsuzForm({ ...asuzForm, showOther: false, oiv: e.target.value, oivOther: "" });
                            }
                          }}
                          className="w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                        >
                          <option value="">— Выберите орган власти —</option>
                          {oivSelectList.map((name) => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                          <option value="other">Другое</option>
                        </select>
                        {asuzForm.showOther && (
                          <input
                            type="text"
                            required
                            value={asuzForm.oivOther}
                            onChange={(e) => setAsuzForm({ ...asuzForm, oivOther: e.target.value })}
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
                        value={asuzForm.email}
                        onChange={(e) => setAsuzForm({ ...asuzForm, email: e.target.value })}
                        className="w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="example@mail.ru"
                      />
                    </div>
                  )}

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Телефон для обратной связи
                    </label>
                    <input
                      type="tel"
                      value={asuzForm.phone}
                      onChange={(e) => setAsuzForm({ ...asuzForm, phone: e.target.value })}
                      readOnly={!!user}
                      className={`w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                        user ? "bg-muted cursor-not-allowed" : ""
                      }`}
                      placeholder="+7 (000) 000-00-00"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Тема <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={asuzForm.topic}
                      onChange={(e) => setAsuzForm({ ...asuzForm, topic: e.target.value })}
                      className="w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Кратко опишите суть обращения"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Описание заявки <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      required
                      value={asuzForm.description}
                      onChange={(e) => setAsuzForm({ ...asuzForm, description: e.target.value })}
                      rows={4}
                      className="w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Подробно опишите проблему или вопрос..."
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="text-sm font-medium text-foreground mb-2">
                    Уведомления о статусе заявки:
                  </div>
                  <div className="flex gap-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.checked)}
                        className="accent-gov-navy"
                      />
                      <span className="text-sm">Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifySms}
                        onChange={(e) => setNotifySms(e.target.checked)}
                        className="accent-gov-navy"
                      />
                      <span className="text-sm">SMS</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gov-navy text-white rounded text-sm font-medium hover:bg-gov-blue transition-colors"
                  >
                    Отправить заявку
                  </button>
                </div>
              </form>
            )}
            </div>

            {/* Контейнер "Формы заявок" */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white border border-border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                  <span className="text-sm font-medium text-foreground">Формы заявок</span>
                  {user?.role === "admin" && (
                    <button
                      onClick={() => setShowAddTileModal(true)}
                      className="flex items-center gap-1 text-xs text-gov-accent hover:text-gov-navy transition-colors"
                    >
                      <Icon name="Plus" size={13} />
                      Добавить
                    </button>
                  )}
                </div>
                <div className="p-3 overflow-y-auto max-h-[420px]">
                  {currentTiles.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <Icon name="FolderOpen" size={28} className="mx-auto mb-2 opacity-30" />
                      <p className="text-xs">Нет прикреплённых форм</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {currentTiles.map((tile) => (
                        <div
                          key={tile.id}
                          className="relative group"
                          style={{ width: "113px", height: "113px" }}
                        >
                          <div className="w-full h-full border border-border rounded-lg bg-white hover:shadow-md transition-shadow flex flex-col items-center justify-center gap-1.5 p-2 cursor-pointer">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${FILE_TYPE_COLORS[tile.fileType]}`}>
                              <Icon name={FILE_TYPE_ICONS[tile.fileType]} size={18} />
                            </div>
                            <span className="text-[10px] text-center text-foreground leading-tight line-clamp-3 w-full">
                              {tile.name}
                            </span>
                            <span className="text-[9px] text-muted-foreground uppercase font-medium">
                              .{tile.fileType}
                            </span>
                          </div>
                          {user?.role === "admin" && (
                            <button
                              onClick={() => handleRemoveTile(tile.id)}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-destructive text-white rounded-full text-[9px] items-center justify-center hidden group-hover:flex transition-all"
                            >
                              <Icon name="X" size={9} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Модальное окно добавления плитки */}
          {showAddTileModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowAddTileModal(false)}>
              <div className="bg-white rounded-xl shadow-xl p-6 w-80" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Добавить форму заявки</h3>
                  <button onClick={() => setShowAddTileModal(false)} className="text-muted-foreground hover:text-foreground">
                    <Icon name="X" size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Название</label>
                    <input
                      type="text"
                      value={newTile.name}
                      onChange={(e) => setNewTile({ ...newTile, name: e.target.value })}
                      className="w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Название документа"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Имя файла</label>
                    <input
                      type="text"
                      value={newTile.fileName}
                      onChange={(e) => setNewTile({ ...newTile, fileName: e.target.value })}
                      className="w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="document.docx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Формат</label>
                    <select
                      value={newTile.fileType}
                      onChange={(e) => setNewTile({ ...newTile, fileType: e.target.value as RequestFormTile["fileType"] })}
                      className="w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                    >
                      <option value="docx">.docx — Word</option>
                      <option value="xls">.xls — Excel</option>
                      <option value="pdf">.pdf — PDF</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => setShowAddTileModal(false)}
                    className="flex-1 px-4 py-2 text-sm border border-border rounded hover:bg-muted transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleAddTile}
                    disabled={!newTile.name.trim() || !newTile.fileName.trim()}
                    className="flex-1 px-4 py-2 text-sm bg-gov-navy text-white rounded hover:bg-gov-blue transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Добавить
                  </button>
                </div>
              </div>
            </div>
          )}
          </>
        )}

        {activeTab === "website" && (
          <div className="max-w-xl">
            <h2 className="font-semibold text-foreground mb-4">Сайт информационной системы</h2>
            <div className="bg-white border border-border rounded-lg p-6">
              {system.websiteUrl ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gov-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Globe" size={22} className="text-gov-navy" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">{system.shortName}</div>
                    <a
                      href={system.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gov-accent hover:underline text-sm flex items-center gap-1"
                    >
                      {system.websiteUrl}
                      <Icon name="ExternalLink" size={12} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Icon name="Globe" size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Сайт не указан</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "webinars" && (
          <div className="max-w-3xl">
            <h2 className="font-semibold text-foreground mb-4">Вебинары и обучающие материалы</h2>
            <div className="bg-white border border-border rounded-lg p-6">
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Video" size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Вебинары будут добавлены администратором</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}