import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { getTicketById, STATUS_LABELS, STATUS_COLORS, TicketMessage } from "@/data/tickets";

interface User {
  name: string;
  oiv: string;
  phone: string;
  role: "admin" | "user";
}

interface TicketPageProps {
  user: User | null;
}

function formatTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function TicketPage({ user }: TicketPageProps) {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const ticket = ticketId ? getTicketById(ticketId) : undefined;

  const [messages, setMessages] = useState<TicketMessage[]>(ticket?.messages ?? []);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!ticket) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold mb-2">Заявка не найдена</h2>
          <button onClick={() => navigate(-1)} className="text-gov-accent hover:underline text-sm">
            Назад
          </button>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!text.trim()) return;
    const msg: TicketMessage = {
      id: `m-${Date.now()}`,
      author: "user",
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  const handleFileAttach = () => {
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Шапка */}
      <div className="bg-gov-navy text-white">
        <div className="max-w-[900px] mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-3 transition-colors"
          >
            <Icon name="ChevronLeft" size={16} />
            Назад
          </button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-white/50 font-mono">№ {ticket.number}</span>
                <span className="text-white/30">•</span>
                <span className="text-xs text-white/50">{ticket.systemName}</span>
                <span className="text-white/30">•</span>
                <span className="text-xs text-white/50">{ticket.createdAt}</span>
              </div>
              <h1 className="font-semibold text-lg leading-tight">{ticket.topic}</h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 bg-white/10 rounded-full px-3 py-1">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_COLORS[ticket.status]}`} />
              <span className="text-xs text-white/80">{STATUS_LABELS[ticket.status]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[900px] mx-auto px-6 py-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.author === "user";
            return (
              <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-gov-navy flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                    <Icon name="Headphones" size={14} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[70%] ${isUser ? "" : ""}`}>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      isUser
                        ? "bg-gov-navy text-white rounded-tr-sm"
                        : "bg-white border border-border text-foreground rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className={`text-[11px] text-muted-foreground mt-1 ${isUser ? "text-right" : "text-left"}`}>
                    {isUser ? "Вы" : "Техподдержка"} · {formatTime(msg.timestamp)}
                  </div>
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-gov-accent flex items-center justify-center flex-shrink-0 ml-2 mt-1">
                    <Icon name="User" size={14} className="text-white" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Поле ввода */}
      <div className="border-t border-border bg-white">
        <div className="max-w-[900px] mx-auto px-6 py-4">
          {ticket.status === "closed" ? (
            <div className="flex items-center gap-2 justify-center py-2 text-sm text-muted-foreground">
              <Icon name="Lock" size={15} />
              Заявка закрыта. Отправка сообщений недоступна.
            </div>
          ) : (
            <div className="flex items-end gap-2">
              <button
                onClick={handleFileAttach}
                title="Прикрепить файл"
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <Icon name="Paperclip" size={16} />
              </button>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={2}
                className="flex-1 border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Введите сообщение… (Enter — отправить, Shift+Enter — перенос строки)"
              />
              <button
                onClick={handleSend}
                disabled={!text.trim()}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-gov-navy text-white rounded-lg text-sm font-medium hover:bg-gov-blue transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Icon name="Send" size={15} />
                Отправить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
