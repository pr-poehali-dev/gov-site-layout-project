export type TicketStatus = "in_progress" | "closed";

export interface TicketMessage {
  id: string;
  author: "user" | "support";
  text: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  number: string;
  systemId: string;
  systemName: string;
  topic: string;
  status: TicketStatus;
  createdAt: string;
  messages: TicketMessage[];
}

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "ticket-epgu-1",
    number: "1234567890",
    systemId: "epgu",
    systemName: "ЕПГУ",
    topic: "Создать учётную запись",
    status: "closed",
    createdAt: "2026-03-10",
    messages: [
      {
        id: "m1",
        author: "user",
        text: "Добрый день! Прошу создать учётную запись для нового сотрудника — Иванова Ивана Ивановича.",
        timestamp: "2026-03-10T09:15:00",
      },
      {
        id: "m2",
        author: "support",
        text: "Добрый день! Заявка принята в работу. Уточните, пожалуйста, подразделение и должность сотрудника.",
        timestamp: "2026-03-10T10:30:00",
      },
      {
        id: "m3",
        author: "user",
        text: "Подразделение: Отдел информационных технологий. Должность: Специалист 1 категории.",
        timestamp: "2026-03-10T10:45:00",
      },
      {
        id: "m4",
        author: "support",
        text: "Учётная запись создана. Данные для входа направлены на корпоративную почту. Заявка закрыта.",
        timestamp: "2026-03-10T14:00:00",
      },
    ],
  },
  {
    id: "ticket-epgu-2",
    number: "1234567891",
    systemId: "epgu",
    systemName: "ЕПГУ",
    topic: "Отредактировать учётную запись",
    status: "in_progress",
    createdAt: "2026-03-20",
    messages: [
      {
        id: "m5",
        author: "user",
        text: "Прошу изменить роль пользователя Петрова П.П. с «Оператор» на «Администратор».",
        timestamp: "2026-03-20T11:00:00",
      },
      {
        id: "m6",
        author: "support",
        text: "Заявка принята. Для изменения роли требуется согласование с руководителем. Ожидаем подтверждения.",
        timestamp: "2026-03-20T12:20:00",
      },
    ],
  },
  {
    id: "ticket-smev-1",
    number: "1234567890",
    systemId: "smev",
    systemName: "СМЭВ",
    topic: "Создать учётную запись",
    status: "closed",
    createdAt: "2026-03-12",
    messages: [
      {
        id: "m7",
        author: "user",
        text: "Необходимо создать учётную запись в СМЭВ для подключения нового участника взаимодействия.",
        timestamp: "2026-03-12T08:50:00",
      },
      {
        id: "m8",
        author: "support",
        text: "Заявка принята. Учётная запись создана, сертификат выпущен. Заявка закрыта.",
        timestamp: "2026-03-12T15:30:00",
      },
    ],
  },
  {
    id: "ticket-smev-2",
    number: "1234567891",
    systemId: "smev",
    systemName: "СМЭВ",
    topic: "Отредактировать учётную запись",
    status: "in_progress",
    createdAt: "2026-03-21",
    messages: [
      {
        id: "m9",
        author: "user",
        text: "Прошу обновить контактные данные и изменить права доступа для учётной записи smev_user_042.",
        timestamp: "2026-03-21T09:30:00",
      },
      {
        id: "m10",
        author: "support",
        text: "Заявка зарегистрирована, взята в работу. Ожидайте ответа в течение рабочего дня.",
        timestamp: "2026-03-21T10:05:00",
      },
    ],
  },
];

export const STATUS_LABELS: Record<TicketStatus, string> = {
  in_progress: "В работе",
  closed: "Закрыта",
};

export const STATUS_COLORS: Record<TicketStatus, string> = {
  in_progress: "bg-yellow-400",
  closed: "bg-green-500",
};

export function getTicketsBySystem(systemId: string): Ticket[] {
  return MOCK_TICKETS.filter((t) => t.systemId === systemId);
}

export function getAllTickets(): Ticket[] {
  return MOCK_TICKETS;
}

export function getTicketById(id: string): Ticket | undefined {
  return MOCK_TICKETS.find((t) => t.id === id);
}
