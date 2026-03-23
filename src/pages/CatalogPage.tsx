import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { oivList } from "@/data/oiv";
import Icon from "@/components/ui/icon";

export default function CatalogPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedOivId, setSelectedOivId] = useState<string | null>(null);

  const filtered = oivList
    .map((oiv) => ({
      ...oiv,
      systems: oiv.systems.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.shortName.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((oiv) => {
      if (selectedOivId && oiv.id !== selectedOivId) return false;
      return oiv.systems.length > 0;
    });

  return (
    <div className="flex-1 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">Каталог информационных систем</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Все информационные системы органов власти Краснодарского края
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-input rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
              placeholder="Поиск информационной системы..."
            />
          </div>
          <select
            value={selectedOivId || ""}
            onChange={(e) => setSelectedOivId(e.target.value || null)}
            className="border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
          >
            <option value="">Все органы власти</option>
            {oivList.map((oiv) => (
              <option key={oiv.id} value={oiv.id}>{oiv.shortName}</option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          {filtered.map((oiv) => (
            <div key={oiv.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3">
                  {oiv.shortName}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {oiv.systems.map((system) => (
                  <button
                    key={system.id}
                    onClick={() => navigate(`/system/${system.id}`)}
                    className="group bg-white border border-border rounded-lg p-4 text-left hover:border-gov-accent hover:shadow-md transition-all animate-fade-in"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gov-light rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 transition-colors">
                        <Icon name="Monitor" size={18} className="text-gov-navy" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-foreground">{system.shortName}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 leading-tight line-clamp-2">{system.name}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {Object.entries(system.tabs).filter(([, v]) => v).map(([k]) => (
                        <span key={k} className="text-[10px] bg-gov-light text-gov-navy px-1.5 py-0.5 rounded">
                          {k === "description" ? "Описание" : k === "instructions" ? "Инструкции" : k === "npa" ? "НПА" : k === "asuz" ? "АСУЗ" : k === "website" ? "Сайт" : "Вебинары"}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
