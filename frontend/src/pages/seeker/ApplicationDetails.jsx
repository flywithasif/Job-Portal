import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  MapPin,
  MessageSquare,
  UserRound,
  Video,
  XCircle,
} from "lucide-react";

const applications = [
  {
    id: "1",
    jobId: "1",
    title: "Senior Frontend Developer",
    company: "TechNova Solutions",
    location: "Gurugram, Haryana",
    type: "Full-time",
    salary: "₹10L - ₹16L per year",
    appliedDate: "28 Sep 2026",
    status: "Interview",
    recruiter: "Priya Sharma",
    recruiterRole: "Talent Acquisition",
    recruiterEmail: "careers@technova.example",
    resume: "Alex_Johnson_Resume.pdf",
    interviewDate: "To be confirmed",
    interviewType: "Video interview",
    timeline: [
      {
        title: "Application submitted",
        date: "28 Sep 2026",
        description: "Your application was successfully submitted.",
        completed: true,
      },
      {
        title: "Application under review",
        date: "29 Sep 2026",
        description: "The recruitment team reviewed your application.",
        completed: true,
      },
      {
        title: "Shortlisted",
        date: "30 Sep 2026",
        description: "Your profile moved to the next hiring stage.",
        completed: true,
      },
      {
        title: "Interview",
        date: "Awaiting confirmation",
        description: "Interview scheduling details are not yet available.",
        completed: true,
      },
    ],
  },
  {
    id: "2",
    jobId: "2",
    title: "React Developer",
    company: "DigitalCraft Labs",
    location: "Remote",
    type: "Full-time",
    salary: "₹8L - ₹14L per year",
    appliedDate: "25 Sep 2026",
    status: "Under Review",
    recruiter: "Recruitment Team",
    recruiterRole: "Hiring Team",
    recruiterEmail: "careers@digitalcraft.example",
    resume: "Alex_Johnson_Resume.pdf",
    interviewDate: "Not scheduled",
    interviewType: "Not scheduled",
    timeline: [
      {
        title: "Application submitted",
        date: "25 Sep 2026",
        description: "Your application was successfully submitted.",
        completed: true,
      },
      {
        title: "Under review",
        date: "In progress",
        description: "Your application is awaiting a hiring decision.",
        completed: true,
      },
    ],
  },
];

const statusStyles = {
  Applied: "bg-blue-50 text-blue-700 border-blue-200",
  "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
  Shortlisted: "bg-violet-50 text-violet-700 border-violet-200",
  Interview: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Selected: "bg-green-50 text-green-700 border-green-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function ApplicationDetails() {
  const { id } = useParams();

  const application = applications.find(
    (item) => item.id === id || item.jobId === id,
  );

  if (!application) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md text-center">
          <FileText className="mx-auto text-slate-400" size={42} />
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Application not found
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            This application could not be found in the demo data.
          </p>
          <Link
            to="/applied-jobs"
            className="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to applications
          </Link>
        </div>
      </div>
    );
  }

  const isRejected = application.status === "Rejected";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            to="/applied-jobs"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Applied Jobs
          </Link>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-blue-600">
                {application.company
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {application.title}
                </h1>

                <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Building2 size={16} />
                  {application.company}
                </p>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} />
                    {application.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BriefcaseBusiness size={15} />
                    {application.type}
                  </span>
                </div>
              </div>
            </div>

            <span
              className={`w-fit rounded-full border px-3 py-1.5 text-sm font-semibold ${
                statusStyles[application.status] || statusStyles.Applied
              }`}
            >
              {application.status}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <div className="space-y-6">
          {/* Application Timeline */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Clock3 size={19} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">
                  Application Timeline
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Follow your application progress.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-0">
              {application.timeline.map((step, index) => {
                const isLast = index === application.timeline.length - 1;

                return (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          step.completed
                            ? isRejected && isLast
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {isRejected && isLast ? (
                          <XCircle size={18} />
                        ) : (
                          <CheckCircle2 size={18} />
                        )}
                      </div>

                      {!isLast && (
                        <div className="my-1 min-h-10 w-px flex-1 bg-slate-200" />
                      )}
                    </div>

                    <div className={isLast ? "pb-0" : "pb-7"}>
                      <h3 className="font-semibold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-slate-400">
                        {step.date}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Submitted Resume */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <FileText size={19} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">
                  Submitted Resume
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Resume associated with this application.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <FileText size={20} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {application.resume}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Demo resume record
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled
                title="Resume download will be available after backend integration"
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-400"
              >
                <Download size={15} />
                Download
              </button>
            </div>
          </section>

          {/* Interview Details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CalendarDays size={19} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">
                  Interview Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your interview schedule and format.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <InfoItem
                label="Schedule"
                value={application.interviewDate}
                icon={CalendarDays}
              />
              <InfoItem
                label="Interview format"
                value={application.interviewType}
                icon={Video}
              />
            </div>

            <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
              Interview details will appear here when they are confirmed by
              the recruitment team.
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Application Summary</h2>

            <div className="mt-5 space-y-4">
              <InfoItem
                label="Date applied"
                value={application.appliedDate}
                icon={CalendarDays}
              />
              <InfoItem
                label="Employment type"
                value={application.type}
                icon={BriefcaseBusiness}
              />
              <InfoItem
                label="Salary range"
                value={application.salary}
                icon={FileText}
              />
              <InfoItem
                label="Current status"
                value={application.status}
                icon={CheckCircle2}
              />
            </div>

            <Link
              to={`/jobs/${application.jobId}`}
              className="mt-6 flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              View Job Description
            </Link>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserRound size={18} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Recruiter Details</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Hiring contact
                </p>
              </div>
            </div>

            <h3 className="mt-5 font-semibold text-slate-900">
              {application.recruiter}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {application.recruiterRole}
            </p>

            <div className="mt-4 rounded-xl bg-slate-50 p-3">
              <p className="break-all text-sm text-slate-600">
                {application.recruiterEmail}
              </p>
            </div>

            <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
              <MessageSquare size={15} className="mt-0.5 shrink-0" />
              Contact details are illustrative demo data. Messaging will be
              enabled after backend integration.
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}

function InfoItem({ label, value, icon: Icon }) {
  return (
    <div className="flex min-w-0 gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}
