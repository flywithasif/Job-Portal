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
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  clearReadNotifications,
  deleteNotification,
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notificationService";

// ============================================
// FILTERS
// ============================================

const filters = [
  {
    label: "All",
    value: "All",
  },
  {
    label: "Unread",
    value: "Unread",
  },
  {
    label: "Read",
    value: "Read",
  },
];

// ============================================
// NOTIFICATION TYPE CONFIG
// ============================================

const notificationConfig = {
  INTERVIEW: {
    label: "Interview",
    icon: CalendarDays,
    style: "bg-emerald-50 text-emerald-600",
  },

  APPLICATION: {
    label: "Application",
    icon: FileText,
    style: "bg-blue-50 text-blue-600",
  },

  SHORTLIST: {
    label: "Shortlisted",
    icon: UserRoundCheck,
    style: "bg-violet-50 text-violet-600",
  },

  ACCEPTED: {
    label: "Accepted",
    icon: CheckCheck,
    style: "bg-emerald-50 text-emerald-600",
  },

  REJECTED: {
    label: "Application update",
    icon: XCircle,
    style: "bg-red-50 text-red-600",
  },

  JOB: {
    label: "Job alert",
    icon: BriefcaseBusiness,
    style: "bg-amber-50 text-amber-600",
  },

  PROFILE: {
    label: "Profile",
    icon: UserRoundCheck,
    style: "bg-slate-100 text-slate-600",
  },

  SYSTEM: {
    label: "System",
    icon: Bell,
    style: "bg-slate-100 text-slate-600",
  },
};

// ============================================
// DATE FORMATTER
// ============================================

const formatTime = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// ============================================
// DATE GROUP
// ============================================

const getDateGroup = (dateValue) => {
  if (!dateValue) {
    return "Earlier";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Earlier";
  }

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const yesterday = new Date(today);

  yesterday.setDate(today.getDate() - 1);

  const notificationDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (
    notificationDate.getTime() ===
    today.getTime()
  ) {
    return "Today";
  }

  if (
    notificationDate.getTime() ===
    yesterday.getTime()
  ) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

// ============================================
// NOTIFICATIONS PAGE
// ============================================

export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

  const [activeFilter, setActiveFilter] =
    useState("All");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  // ============================================
  // LOAD NOTIFICATIONS
  // ============================================

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const response = await getMyNotifications({
        page: 1,
        limit: 50,
      });

      setNotifications(response?.data || []);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load notifications.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    loadNotifications();
  }, []);

  // ============================================
  // UNREAD COUNT
  // ============================================

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => !notification.read,
    ).length;
  }, [notifications]);

  // ============================================
  // FILTER + SEARCH
  // ============================================

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications.filter((item) => {
      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Unread" && !item.read) ||
        (activeFilter === "Read" && item.read);

      const matchesSearch =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.message?.toLowerCase().includes(query) ||
        item.type?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [
    notifications,
    activeFilter,
    search,
  ]);

  // ============================================
  // GROUP NOTIFICATIONS BY DATE
  // ============================================

  const groupedNotifications = useMemo(() => {
    return filteredNotifications.reduce(
      (groups, item) => {
        const date = getDateGroup(
          item.createdAt,
        );

        if (!groups[date]) {
          groups[date] = [];
        }

        groups[date].push(item);

        return groups;
      },
      {},
    );
  }, [filteredNotifications]);

  // ============================================
  // OPEN NOTIFICATION
  // ============================================

  const handleNotificationClick = async (
    item,
  ) => {
    try {
      // Mark unread notification as read first.
      if (!item.read) {
        await markNotificationAsRead(
          item._id,
        );

        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === item._id
              ? {
                  ...notification,
                  read: true,
                  readAt:
                    new Date().toISOString(),
                }
              : notification,
          ),
        );
      }

      // Navigate to notification target.
      if (item.link) {
        navigate(item.link);
        return;
      }

      // Fallback if notification has no link.
      navigate("/dashboard/notifications");
    } catch (error) {
      console.error(
        "Failed to open notification:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to open notification.",
      );
    }
  };

  // ============================================
  // MARK ONE AS READ
  // ============================================

  const handleMarkAsRead = async (
    event,
    notificationId,
  ) => {
    // Prevent parent notification click.
    event.stopPropagation();

    try {
      await markNotificationAsRead(
        notificationId,
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                read: true,
                readAt:
                  new Date().toISOString(),
              }
            : notification,
        ),
      );

      toast.success(
        "Notification marked as read.",
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to update notification.",
      );
    }
  };

  // ============================================
  // MARK ALL AS READ
  // ============================================

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      toast("You're all caught up!");
      return;
    }

    try {
      setActionLoading(true);

      await markAllNotificationsAsRead();

      const now = new Date().toISOString();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
          readAt:
            notification.readAt || now,
        })),
      );

      toast.success(
        "All notifications marked as read.",
      );
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to update notifications.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================
  // DELETE ONE NOTIFICATION
  // ============================================

  const handleDeleteNotification = async (
    event,
    notificationId,
  ) => {
    // Prevent parent notification click.
    event.stopPropagation();

    try {
      await deleteNotification(
        notificationId,
      );

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification._id !== notificationId,
        ),
      );

      toast.success(
        "Notification removed.",
      );
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error,
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete notification.",
      );
    }
  };

  // ============================================
  // CLEAR READ NOTIFICATIONS
  // ============================================

  const handleClearReadNotifications =
    async () => {
      const hasReadNotifications =
        notifications.some(
          (notification) =>
            notification.read,
        );

      if (!hasReadNotifications) {
        toast("No read notifications to clear.");
        return;
      }

      try {
        setActionLoading(true);

        await clearReadNotifications();

        setNotifications((prev) =>
          prev.filter(
            (notification) =>
              !notification.read,
          ),
        );

        toast.success(
          "Read notifications cleared.",
        );
      } catch (error) {
        console.error(
          "Failed to clear read notifications:",
          error,
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to clear notifications.",
        );
      } finally {
        setActionLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ============================================
          HEADER
      ============================================ */}

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
                Stay updated on your applications
                and job opportunities.
              </p>
            </div>

            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={
                actionLoading ||
                unreadCount === 0
              }
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck size={16} />

              Mark all as read
            </button>
          </div>
        </div>
      </header>

      {/* ============================================
          MAIN
      ============================================ */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ============================================
            SUMMARY
        ============================================ */}

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
            value={
              notifications.length -
              unreadCount
            }
            icon={MailOpen}
            iconStyle="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* ============================================
            FILTERS + SEARCH
        ============================================ */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2 overflow-x-auto">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    setActiveFilter(
                      filter.value,
                    )
                  }
                  className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === filter.value
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}

                  {filter.value ===
                    "Unread" &&
                    unreadCount > 0 && (
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
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search notifications..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>
        </section>

        {/* ============================================
            NOTIFICATION LIST
        ============================================ */}

        <section className="mt-5">
          {loading ? (
            <LoadingState />
          ) : filteredNotifications.length >
            0 ? (
            <div className="space-y-6">
              {Object.entries(
                groupedNotifications,
              ).map(([date, items]) => (
                <div key={date}>
                  <h2 className="mb-3 text-sm font-semibold text-slate-500">
                    {date}
                  </h2>

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {items.map(
                      (item, index) => (
                        <NotificationItem
                          key={item._id}
                          item={item}
                          isLast={
                            index ===
                            items.length - 1
                          }
                          onOpen={
                            handleNotificationClick
                          }
                          onRead={
                            handleMarkAsRead
                          }
                          onDelete={
                            handleDeleteNotification
                          }
                        />
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              hasNotifications={
                notifications.length > 0
              }
            />
          )}
        </section>

        {/* ============================================
            CLEAR READ
        ============================================ */}

        {!loading &&
          notifications.some(
            (item) => item.read,
          ) && (
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={
                  handleClearReadNotifications
                }
                disabled={actionLoading}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={15} />

                Clear read notifications
              </button>
            </div>
          )}
      </main>
    </div>
  );
}

// ============================================
// SUMMARY CARD
// ============================================

function SummaryCard({
  label,
  value,
  icon: Icon,
  iconStyle,
}) {
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

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// NOTIFICATION ITEM
// ============================================

function NotificationItem({
  item,
  isLast,
  onOpen,
  onRead,
  onDelete,
}) {
  const config =
    notificationConfig[item.type] ||
    notificationConfig.SYSTEM;

  const Icon = config.icon;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item)}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          onOpen(item);
        }
      }}
      className={`group relative flex cursor-pointer flex-col gap-4 p-4 outline-none transition hover:bg-slate-50 focus:bg-slate-50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:flex-row sm:items-start sm:p-5 ${
        !item.read
          ? "bg-blue-50/40"
          : "bg-white"
      } ${
        !isLast
          ? "border-b border-slate-100"
          : ""
      }`}
    >
      {/* ==========================================
          ICON
      =========================================== */}

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.style}`}
      >
        <Icon size={19} />
      </div>

      {/* ==========================================
          CONTENT
      =========================================== */}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-slate-900">
            {item.title}
          </h3>

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

          {formatTime(item.createdAt)}
        </div>

        {/* ========================================
            CLICK HINT
        ========================================= */}

        <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition group-hover:gap-2">
          View details
          <span aria-hidden="true">→</span>
        </div>
      </div>

      {/* ==========================================
          ACTION BUTTONS
      =========================================== */}

      <div className="flex shrink-0 items-center gap-2 sm:ml-2">
        {!item.read && (
          <button
            type="button"
            onClick={(event) =>
              onRead(event, item._id)
            }
            title="Mark as read"
            aria-label={`Mark ${item.title} as read`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <Check size={16} />
          </button>
        )}

        <button
          type="button"
          onClick={(event) =>
            onDelete(event, item._id)
          }
          title="Delete notification"
          aria-label={`Delete ${item.title}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}

// ============================================
// LOADING STATE
// ============================================

function LoadingState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

      <p className="mt-4 text-sm text-slate-500">
        Loading notifications...
      </p>
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================

function EmptyState({
  hasNotifications,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Bell size={24} />
      </div>

      <h2 className="mt-4 text-lg font-bold text-slate-900">
        {hasNotifications
          ? "No notifications found"
          : "You're all caught up"}
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        {hasNotifications
          ? "Try another filter or search term."
          : "New application and account updates will appear here."}
      </p>
    </div>
  );
}