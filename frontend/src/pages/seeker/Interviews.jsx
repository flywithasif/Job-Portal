import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MapPin,
  Search,
  Video,
  XCircle,
} from "lucide-react";

const interviewsData = [
  {
    id: 1,
    role: "Junior Backend Developer",
    company: "TechNova Solutions",
    location: "Gurugram, Haryana",
    date: "2026-10-06",
    time: "11:00 AM",
    type: "Video Interview",
    status: "Upcoming",
    duration: "45 minutes",
    interviewer: "Rahul Sharma",
    meetingLink: "https://meet.google.com/",
    note: "Prepare Node.js, Express.js, MongoDB and REST APIs.",
  },
  {
    id: 2,
    role: "MERN Stack Developer",
    company: "PixelCraft Technologies",
    location: "Remote",
    date: "2026-10-08",
    time: "03:30 PM",
    type: "Video Interview",
    status: "Upcoming",
    duration: "60 minutes",
    interviewer: "Priya Verma",
    meetingLink: "",
    note: "Revise React hooks, authentication and project architecture.",
  },
  {
    id: 3,
    role: "Frontend Developer",
    company: "BrightWeb Studio",
    location: "Noida, Uttar Pradesh",
    date: "2026-09-25",
    time: "02:00 PM",
    type: "In-person",
    status: "Completed",
    duration: "30 minutes",
    interviewer: "Amit Singh",
    meetingLink: "",
    note: "Interview completed.",
  },
  {
    id: 4,
    role: "Software Developer Intern",
    company: "CodeBridge Labs",
    location: "Remote",
    date: "2026-09-20",
    time: "10:30 AM",
    type: "Video Interview",
    status: "Cancelled",
    duration: "30 minutes",
    interviewer: "Neha Gupta",
    meetingLink: "",
    note: "This interview was cancelled.",
  },
];

const filters = ["All", "Upcoming", "Completed", "Cancelled"];

const statusStyles = {
  Upcoming: "bg-blue-50 text-blue-700 ring-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Cancelled: "bg-red-50 text-red-700 ring-red-200",
};

function formatDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function InterviewCard({ interview }) {
  const isUpcoming = interview.status === "Upcoming";
  const isCompleted = interview.status === "Completed";

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Building2 size={23} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                {interview.role}
              </h3>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                  statusStyles[interview.status]
                }`}
              >
                {interview.status}
              </span>
            </div>

            <p className="mt-1 font-medium text-slate-600">
              {interview.company}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={15} />
                {formatDate(interview.date)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={15} />
                {interview.time}
              </span>
            </div>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
          {interview.type === "Video Interview" ? (
            <Video size={15} />
          ) : (
            <MapPin size={15} />
          )}
          {interview.type}
        </span>
      </div>

      <div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-slate-500">Interviewer</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {interview.interviewer}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-500">Duration</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {interview.duration}
          </p>
        </div>

        <div className="sm:col-span-2">
          <p className="text-xs font-medium text-slate-500">Location</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {interview.location}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {interview.note}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <Link
          to="/applied-jobs"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
        >
          View applications
          <ArrowUpRight size={15} />
        </Link>

        {isUpcoming && interview.meetingLink ? (
          <a
            href={interview.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Join interview
            <ExternalLink size={15} />
          </a>
        ) : isUpcoming ? (
          <span className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-medium text-slate-500">
            Meeting link not available
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
            {isCompleted ? (
              <CheckCircle2 size={16} className="text-emerald-600" />
            ) : (
              <XCircle size={16} className="text-red-500" />
            )}
            {isCompleted ? "Interview completed" : "Interview cancelled"}
          </span>
        )}
      </div>
    </article>
  );
}

export default function Interviews() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = useMemo(
    () => ({
      total: interviewsData.length,
      upcoming: interviewsData.filter(
        (interview) => interview.status === "Upcoming",
      ).length,
      completed: interviewsData.filter(
        (interview) => interview.status === "Completed",
      ).length,
      cancelled: interviewsData.filter(
        (interview) => interview.status === "Cancelled",
      ).length,
    }),
    [],
  );

  const filteredInterviews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return interviewsData
      .filter(
        (interview) =>
          activeFilter === "All" || interview.status === activeFilter,
      )
      .filter((interview) =>
        [
          interview.role,
          interview.company,
          interview.location,
          interview.interviewer,
        ].some((value) => value.toLowerCase().includes(query)),
      )
      .sort((a, b) => {
        if (a.status === "Upcoming" && b.status !== "Upcoming") return -1;
        if (a.status !== "Upcoming" && b.status === "Upcoming") return 1;
        return new Date(a.date) - new Date(b.date);
      });
  }, [activeFilter, searchQuery]);

  const statCards = [
    {
      label: "Total interviews",
      value: stats.total,
      icon: CalendarDays,
      color: "bg-slate-100 text-slate-700",
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: Clock3,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              CAREER MANAGEMENT
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Interviews
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage your interview schedule and prepare for your next
              opportunity.
            </p>
          </div>

          <Link
            to="/applied-jobs"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
          >
            View applications
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Statistics */}
        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-slate-500 sm:text-sm">
                    {stat.label}
                  </p>

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon size={18} />
                  </span>
                </div>

                <p className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Interview list */}
        <section className="mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Interview schedule
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredInterviews.length} interview
                {filteredInterviews.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search role or company..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>

          {/* Status filters */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => {
              const count =
                filter === "All"
                  ? stats.total
                  : interviewsData.filter(
                      (interview) => interview.status === filter,
                    ).length;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    activeFilter === filter
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
                  }`}
                >
                  {filter}
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-xs ${
                      activeFilter === filter
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 space-y-4">
            {filteredInterviews.length > 0 ? (
              filteredInterviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <CalendarDays size={23} />
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  No interviews found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Try another filter or search for a different role or company.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}