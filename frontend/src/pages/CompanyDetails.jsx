import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Globe,
  Heart,
  MapPin,
  Users,
} from "lucide-react";

// Demo company data — baad mein backend se connect karenge.
const companies = {
  "techvision-india": {
    name: "TechVision India",
    tagline: "Building technology that moves businesses forward.",
    industry: "Information Technology",
    location: "Gurugram, Haryana",
    size: "201–500 employees",
    founded: "2018",
    website: "https://example.com",
    linkedin: "https://linkedin.com",
    logo: "T",
    description:
      "TechVision India is a technology company focused on building modern digital products and scalable software solutions. Our team works across product engineering, cloud technologies, and digital transformation to help businesses solve meaningful problems.",
    about:
      "We believe great products are built by curious people who collaborate, learn continuously, and take ownership of their work. We provide an environment where people can grow their skills and contribute to real-world projects.",
    benefits: [
      "Flexible working options",
      "Learning and development support",
      "Collaborative team environment",
      "Career growth opportunities",
      "Health and wellness benefits",
      "Modern development tools",
    ],
    jobs: [
      {
        id: "1",
        title: "Junior Backend Developer",
        type: "Full-time",
        location: "Gurugram · Hybrid",
        salary: "₹4–7 LPA",
        posted: "2 days ago",
        level: "Entry level",
      },
      {
        id: "2",
        title: "React Frontend Developer",
        type: "Full-time",
        location: "Gurugram · On-site",
        salary: "₹5–8 LPA",
        posted: "4 days ago",
        level: "Junior",
      },
      {
        id: "3",
        title: "MERN Stack Developer Intern",
        type: "Internship",
        location: "Remote",
        salary: "₹12k–20k/month",
        posted: "1 week ago",
        level: "Internship",
      },
    ],
  },

  "innovate-labs": {
    name: "Innovate Labs",
    tagline: "Turning bold ideas into useful digital products.",
    industry: "Software Development",
    location: "Bengaluru, Karnataka",
    size: "51–200 employees",
    founded: "2020",
    website: "https://example.com",
    linkedin: "https://linkedin.com",
    logo: "I",
    description:
      "Innovate Labs builds digital products and software experiences for businesses. Our teams combine engineering, product thinking, and design to develop solutions for modern challenges.",
    about:
      "We value practical problem-solving, teamwork, and continuous improvement. We encourage team members to explore new technologies and contribute ideas throughout the product development process.",
    benefits: [
      "Flexible work arrangements",
      "Technical learning opportunities",
      "Friendly work culture",
      "Growth and mentorship",
      "Team collaboration",
      "Performance recognition",
    ],
    jobs: [
      {
        id: "4",
        title: "Node.js Developer",
        type: "Full-time",
        location: "Bengaluru · Hybrid",
        salary: "₹5–9 LPA",
        posted: "3 days ago",
        level: "Junior",
      },
      {
        id: "5",
        title: "Frontend Developer Intern",
        type: "Internship",
        location: "Remote",
        salary: "₹10k–18k/month",
        posted: "5 days ago",
        level: "Internship",
      },
    ],
  },
};

function CompanyDetails() {
  const { id } = useParams();
  const company = companies[id];

  if (!company) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Building2 size={30} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Company not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            This company may not exist or its profile may be unavailable.
          </p>

          <Link
            to="/companies"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={17} />
            Browse companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/companies"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            All companies
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Company Hero */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-36 bg-gradient-to-r from-blue-950 via-blue-800 to-indigo-600 sm:h-48">
            <div className="h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_35%)]" />
          </div>

          <div className="px-5 pb-7 sm:px-8 sm:pb-8">
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-blue-50 text-4xl font-bold text-blue-700 shadow-md sm:h-28 sm:w-28">
                  {company.logo}
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                      {company.name}
                    </h1>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 size={13} />
                      Company profile
                    </span>
                  </div>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    {company.tagline}
                  </p>
                </div>
              </div>

              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Visit website
                <ArrowUpRight size={17} />
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-100 pt-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Building2 size={17} className="text-blue-600" />
                {company.industry}
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={17} className="text-blue-600" />
                {company.location}
              </div>

              <div className="flex items-center gap-2">
                <Users size={17} className="text-blue-600" />
                {company.size}
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays size={17} className="text-blue-600" />
                Founded {company.founded}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          {/* Left Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* About Company */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Building2 size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    About the company
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Get to know the organization
                  </p>
                </div>
              </div>

              <p className="text-sm leading-7 text-slate-600">
                {company.description}
              </p>

              <h3 className="mt-7 text-base font-bold text-slate-900">
                Our work culture
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {company.about}
              </p>
            </section>

            {/* Benefits */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                  <Heart size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Benefits and perks
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    What you can expect
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {company.benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Open Jobs */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Open positions
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Explore opportunities at {company.name}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  {company.jobs.length} demo listings
                </span>
              </div>

              <div className="space-y-4">
                {company.jobs.map((job) => (
                  <article
                    key={job.id}
                    className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-200 hover:shadow-md sm:p-6"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div className="min-w-0">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="text-base font-bold text-slate-900 transition hover:text-blue-600 sm:text-lg"
                        >
                          {job.title}
                        </Link>

                        <p className="mt-2 text-sm font-medium text-slate-600">
                          {company.name}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={14} />
                            {job.location}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <BriefcaseBusiness size={14} />
                            {job.type}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 size={14} />
                            {job.posted}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                            {job.level}
                          </span>

                          <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
                            {job.salary}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 sm:w-auto"
                        >
                          View job
                          <ArrowUpRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <p className="mt-5 text-xs leading-5 text-slate-400">
                Demo content: job listings, salaries and company information
                are sample data until the backend is connected.
              </p>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">
                Company overview
              </h2>

              <div className="mt-5 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Building2 size={19} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Industry</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {company.industry}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Users size={19} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Company size</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {company.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <MapPin size={19} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Headquarters</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {company.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <CalendarDays size={19} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Founded</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {company.founded}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <span className="flex items-center gap-2">
                    <Globe size={17} />
                    Company website
                  </span>
                  <ArrowUpRight size={16} />
                </a>

                <a
                  href={company.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <span className="flex items-center gap-2">
                    <Linkedin size={17} />
                    LinkedIn profile
                  </span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-800 to-indigo-700 p-6 text-white shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                <BriefcaseBusiness size={23} />
              </div>

              <h2 className="mt-5 text-xl font-bold">
                Find your next opportunity
              </h2>

              <p className="mt-3 text-sm leading-6 text-blue-100">
                Explore open positions and discover a role that matches your
                skills and career goals.
              </p>

              <Link
                to="/jobs"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
              >
                Explore all jobs
                <ArrowUpRight size={17} />
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default CompanyDetails;