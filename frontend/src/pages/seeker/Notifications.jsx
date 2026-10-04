import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  BellRing,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCheck,
  Clock3,
  FileText,
  MailOpen,
  Search,
  Trash2,
  UserRoundCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const initialNotifications = [
  {
    id: 1,
    type: "interview",
    title: "Interview update",
    message:
      "Your application for Senior Frontend Developer has moved to the interview stage.",
    time: "2 hours ago",
    date: "Today",
    read: false,
    link: "/applications/1",
  },
  {
    id: 2,
    type: "application",
    title: "Application under review",
    message:
      "DigitalCraft Labs is reviewing your application for React Developer.",
    time: "5 hours ago",
    date: "Today",
    read: false,
    link: "/applications/2",
  },
  {
    id: 3,
    type: "shortlist",
    title: "You have been shortlisted",
    message:
      "Your profile has been shortlisted for the MERN Stack Developer position.",
    time: "Yesterday",
    date: "Yesterday",
    read: false,
    link: "/applied-jobs",
  },
  {
    id: 4,
    type: "job",
    title: "New jobs match your interests",
    message:
      "Explore frontend and React developer opportunities that match your skills.",
    time: "Yesterday",
    date: "Yesterday",
    read: true,
    link: "/jobs",
  },
  {
    id: 5,
    type: "application",
    title: "Application submitted",
    message:
      "Your application was submitted successfully. You can track its progress here.",
    time: "3 days ago",
    date: "Earlier",
    read: true,
    link: "/applied-jobs",
  },
  {
    id: 6,
    type: "profile",
    title: "Complete your profile",
    message:
      "Add your latest resume and professional experience to improve your profile.",
    time: "4 days ago",
    date: "Earlier",
    read: true,
    link: "/profile",
  },
];

const notificationConfig = {
  interview: {
    label: "Interview",
    icon: CalendarDays,
    style: "bg-emerald-50 text-emerald-600",
  },
  application: {
    label: "Application",
    icon: FileText,
    style: "bg-blue-50 text-blue-600",
  },
  shortlist: {
    label: "Shortlisted",
    icon: UserRoundCheck,
    style: "bg-violet-50 text-violet-600",
  },
  job: {
    label: "Job alert",
    icon: BriefcaseBusiness,
    style: "bg-amber-50 text-amber-600",
  },
  profile: {
    label: "Profile",
    icon: Bell,
    style: "bg-slate-100 text-slate-600",
  },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const unreadCount = notifications.filter((item) => !item.read).length;

  const filters = [
    { label: "All", value: "All" },
    { label: "Unread", value: "Unread" },
    { label: "Read", value: "Read" },
  ];

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications.filter((item) => {
      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Unread" && !item.read) ||
        (activeFilter === "Read" && item.read);

      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.message.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [notifications, activeFilter, search]);

  const groupedNotifications = useMemo(() => {
    return filteredNotifications.reduce((groups, item) => {
      if (!groups[item.date]) groups[item.date] = [];
      groups[item.date].push(item);
      return groups;
    }, {});
  }, [filteredNotifications]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    );

    toast.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    if (unreadCount === 0) {
      toast("You're all caught up!");
      return;
    }

    setNotifications((prev) =>
      prev.map((item) => ({ ...item, read: true })),
    );

    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    toast.success("Notification removed");
  };

  const clearReadNotifications = () => {
    const readCount = notifications.filter((item) => item.read).length;

    if (readCount === 0) {
      toast("No read notifications to clear");
      return;
    }

    setNotifications((prev) => prev.filter((item) => !item.read));
    toast.success("Read notifications cleared");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Job Seeker
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Notifications
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Stay updated on your applications and job opportunities.
              </p>
            </div>

            <button
              onClick={markAllAsRead}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Total notifications"
            value={notifications.length}
            icon={Bell}
            iconStyle="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            label="Unread"
            value={unreadCount}
            icon={BellRing}
            iconStyle="bg-amber-50 text-amber-600"
          />

          <SummaryCard
            label="Read"
            value={notifications.length - unreadCount}
            icon={MailOpen}
            iconStyle="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* Filters and Search */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2 overflow-x-auto">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === filter.value
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                  {filter.value === "Unread" && unreadCount > 0 && (
                    <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="relative w-full md:max-w-sm">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search notifications..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>
        </section>

        {/* Notification List */}
        <section className="mt-5">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedNotifications).map(([date, items]) => (
                <div key={date}>
                  <h2 className="mb-3 text-sm font-semibold text-slate-500">
                    {date}
                  </h2>

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {items.map((item, index) => (
                      <NotificationItem
                        key={item.id}
                        item={item}
                        isLast={index === items.length - 1}
                        onRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Bell size={24} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                No notifications found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try another filter or search term.
              </p>
            </div>
          )}
        </section>

        {/* Footer Actions */}
        {notifications.some((item) => item.read) && (
          <div className="mt-5 flex justify-end">
            <button
              onClick={clearReadNotifications}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={15} />
              Clear read notifications
            </button>
          </div>
        )}

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
          <div className="flex items-start gap-3">
            <Clock3 size={18} className="mt-0.5 shrink-0 text-blue-600" />
            <p className="text-sm leading-6 text-blue-900">
              These are sample notifications for the frontend demo. Live
              application updates and persistent read status will be connected
              to the backend later.
            </p>
          </div>
        </div>

        <div className="mt-5 text-center">
          <Link
            to="/applied-jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View your applications
            <Check size={15} />
          </Link>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, iconStyle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconStyle}`}
        >
          <Icon size={19} />
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function NotificationItem({ item, isLast, onRead, onDelete }) {
  const config = notificationConfig[item.type] || notificationConfig.application;
  const Icon = config.icon;

  return (
    <article
      className={`flex flex-col gap-4 p-4 transition sm:flex-row sm:items-start sm:p-5 ${
        !item.read ? "bg-blue-50/40" : "bg-white"
      } ${!isLast ? "border-b border-slate-100" : ""}`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.style}`}
      >
        <Icon size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-slate-900">{item.title}</h3>

          {!item.read && (
            <span className="h-2 w-2 rounded-full bg-blue-600" />
          )}

          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
            {config.label}
          </span>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {item.message}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <Clock3 size={13} />
          {item.time}
        </div>

        <Link
          to={item.link}
          onClick={() => {
            if (!item.read) onRead(item.id);
          }}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View details
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:ml-2">
        {!item.read && (
          <button
            onClick={() => onRead(item.id)}
            title="Mark as read"
            aria-label={`Mark ${item.title} as read`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <Check size={16} />
          </button>
        )}

        <button
          onClick={() => onDelete(item.id)}
          title="Delete notification"
          aria-label={`Delete ${item.title}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
