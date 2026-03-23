import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { oivList, InfoSystem, OIV } from "@/data/oiv";
import Icon from "@/components/ui/icon";

interface SelectedSystem {
  system: InfoSystem;
  oiv: OIV;
}

interface HomePageProps {
  selectedSystems: SelectedSystem[];
  onSystemsChange: (systems: SelectedSystem[]) => void;
}

export default function HomePage({ selectedSystems, onSystemsChange }: HomePageProps) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedOiv, setSelectedOiv] = useState<OIV | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    new Set(selectedSystems.map((s) => s.system.id))
  );

  const openModal = () => {
    setCheckedIds(new Set(selectedSystems.map((s) => s.system.id)));
    setSelectedOiv(null);
    setShowModal(true);
  };

  const toggleCheck = (systemId: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(systemId)) next.delete(systemId);
      else next.add(systemId);
      return next;
    });
  };

  const handleSave = () => {
    const result: SelectedSystem[] = [];
    for (const oiv of oivList) {
      for (const system of oiv.systems) {
        if (checkedIds.has(system.id)) {
          result.push({ system, oiv });
        }
      }
    }
    onSystemsChange(result);
    setShowModal(false);
  };

  return (
    <div className="flex-1 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Мои информационные системы</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Персональная панель доступа к ИС органов власти
            </p>
          </div>
          {selectedSystems.length > 0 && (
            <button
              onClick={openModal}
              className="flex items-center gap-2 px-4 py-2 bg-gov-navy text-white text-sm rounded hover:bg-gov-blue transition-colors"
            >
              <Icon name="Settings2" size={16} />
              Настроить
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          {selectedSystems.map(({ system }, idx) => (
            <button
              key={system.id}
              onClick={() => navigate(`/system/${system.id}`)}
              className="group w-[190px] h-[110px] bg-white border border-border rounded-lg p-3 text-left hover:border-gov-accent hover:shadow-md transition-all animate-fade-in flex flex-col justify-between"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="w-8 h-8 bg-gov-light rounded flex items-center justify-center mb-2 group-hover:bg-blue-50 transition-colors">
                <Icon name="Monitor" size={16} className="text-gov-navy" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
                  {system.shortName}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                  {system.name.length > 40 ? system.name.slice(0, 40) + "…" : system.name}
                </div>
              </div>
            </button>
          ))}

          <button
            onClick={openModal}
            className="w-[190px] h-[110px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-gov-accent hover:text-gov-accent hover:bg-blue-50/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon name="Plus" size={20} />
            </div>
            <span className="text-xs font-medium">Добавить ИС</span>
          </button>
        </div>

        {selectedSystems.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">
            <Icon name="LayoutGrid" size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Нажмите «+» чтобы выбрать информационные системы</p>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-scale-in">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg text-foreground">Выбор информационных систем</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Выберите орган власти и отметьте нужные системы
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className="w-64 border-r border-border overflow-y-auto bg-muted/30">
                <div className="p-3">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                    Органы власти
                  </div>
                  {oivList.map((oiv) => (
                    <button
                      key={oiv.id}
                      onClick={() => setSelectedOiv(oiv)}
                      className={`w-full text-left px-3 py-2.5 rounded text-sm transition-colors mb-0.5 ${
                        selectedOiv?.id === oiv.id
                          ? "bg-gov-navy text-white"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className="font-medium leading-tight">{oiv.shortName}</div>
                      <div className={`text-xs mt-0.5 ${selectedOiv?.id === oiv.id ? "text-white/70" : "text-muted-foreground"}`}>
                        {oiv.systems.length} {oiv.systems.length === 1 ? "система" : "систем"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {!selectedOiv ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Icon name="MousePointerClick" size={32} className="mb-3 opacity-40" />
                    <p className="text-sm">Выберите орган власти слева</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-semibold text-foreground mb-1">{selectedOiv.shortName}</div>
                    <div className="text-xs text-muted-foreground mb-4 leading-tight">{selectedOiv.name}</div>
                    <div className="space-y-2">
                      {selectedOiv.systems.map((system) => (
                        <label
                          key={system.id}
                          className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-colors ${
                            checkedIds.has(system.id)
                              ? "border-gov-accent bg-blue-50"
                              : "border-border hover:bg-muted/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checkedIds.has(system.id)}
                            onChange={() => toggleCheck(system.id)}
                            className="mt-0.5 accent-gov-navy"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-foreground">{system.shortName}</div>
                            <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{system.name}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20">
              <span className="text-sm text-muted-foreground">
                Выбрано: <strong className="text-foreground">{checkedIds.size}</strong> систем
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 border border-border rounded text-sm hover:bg-muted transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 bg-gov-navy text-white rounded text-sm hover:bg-gov-blue transition-colors font-medium"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
