
import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Globe,
  MapPin,
  Save,
  Upload,
} from "lucide-react";

import {
  readRecruiterData,
  writeRecruiterData,
  RECRUITER_STORAGE_KEYS,
} from "../../utils/recruiterStorage";

const initialProfile = {
  name: "TechNova Solutions",
  tagline: "Building technology that moves businesses forward.",
  industry: "Information Technology",
  website: "https://example.com",
  location: "Gurugram, Haryana, India",
  size: "11–50 employees",
  founded: "2020",
  email: "careers@example.com",
  linkedin: "https://linkedin.com/",
  description:
    "We are a technology company focused on building reliable digital products and scalable software solutions. Our team works across modern web technologies to solve real business problems.",
  logoUrl: "",
};

const industries = [
  "Information Technology",
  "Software Development",
  "E-commerce",
  "Healthcare",
  "Finance",
  "Education",
  "Marketing & Advertising",
  "Consulting",
  "Other",
];

const companySizes = [
  "1–10 employees",
  "11–50 employees",
  "51–200 employees",
  "201–500 employees",
  "501–1000 employees",
  "1000+ employees",
];

const fieldClass =
  "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50";

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={fieldClass}
      />
    </label>
  );
}

export default function CompanyProfile() {
  const [profile, setProfile] = useState(() =>
    readRecruiterData(
      RECRUITER_STORAGE_KEYS.companyProfile,
      initialProfile,
    ),
  );

  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoError, setLogoError] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);

    setErrors((current) => ({
      ...current,
      [name]: "",
      form: "",
    }));

    if (name === "logoUrl") {
      setLogoError(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (!profile.name.trim()) {
      nextErrors.name = "Company name is required.";
    }

    if (
      profile.website.trim() &&
      !/^https?:\/\/.+\..+/i.test(profile.website.trim())
    ) {
      nextErrors.website =
        "Enter a valid website URL, including https://.";
    }

    if (
      profile.linkedin.trim() &&
      !/^https?:\/\/.+\..+/i.test(profile.linkedin.trim())
    ) {
      nextErrors.linkedin = "Enter a valid LinkedIn URL.";
    }

    if (
      profile.logoUrl.trim() &&
      !/^https?:\/\/.+\..+/i.test(profile.logoUrl.trim())
    ) {
      nextErrors.logoUrl = "Enter a valid image URL.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSaved(false);
      return;
    }

    const persisted = writeRecruiterData(
      RECRUITER_STORAGE_KEYS.companyProfile,
      profile,
    );

    if (!persisted) {
      setSaved(false);

      setErrors((current) => ({
        ...current,
        form: "Could not save in this browser. Check storage settings and try again.",
      }));

      return;
    }

    setSaved(true);
  }

  const initials = profile.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const checklist = [
    ["Company name", Boolean(profile.name.trim())],
    ["Website", Boolean(profile.website.trim())],
    ["Location", Boolean(profile.location.trim())],
    ["Description", Boolean(profile.description.trim())],
    ["Contact email", Boolean(profile.email.trim())],
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-blue-700">
              RECRUITER WORKSPACE
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Company profile
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Introduce your company to candidates and build trust
              with a complete, professional profile.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Building2 size={17} />
            Employer information
          </div>
        </div>

        {/* Company identity card */}
        <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="h-28 bg-gradient-to-r from-slate-900 via-blue-950 to-blue-700 sm:h-36" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-11 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-blue-50 text-2xl font-bold text-blue-700 shadow-sm sm:h-24 sm:w-24">
                  {profile.logoUrl && !logoError ? (
                    <img
                      src={profile.logoUrl}
                      alt={`${profile.name} logo`}
                      className="h-full w-full object-cover"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    initials || <Building2 size={30} />
                  )}
                </div>

                <div className="min-w-0 pb-1">
                  <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                    {profile.name || "Your company name"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {profile.industry}
                  </p>
                </div>
              </div>

              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <CheckCircle2 size={14} />
                Company profile
              </span>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-600">
              {profile.tagline ||
                "Add a short tagline for your company."}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} />
                {profile.location || "Company location"}
              </span>

              <span className="inline-flex items-center gap-1.5 break-all">
                <Globe size={15} />
                {profile.website || "Company website"}
              </span>
            </div>
          </div>
        </section>

        {/* Profile form */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-6">
              {/* Basic information */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Basic information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    The essential details candidates see about your company.
                  </p>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <Field
                      label="Company name *"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="Your company name"
                    />

                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">
                      Industry
                    </span>

                    <select
                      name="industry"
                      value={profile.industry}
                      onChange={handleChange}
                      className={fieldClass}
                    >
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="sm:col-span-2">
                    <Field
                      label="Company tagline"
                      name="tagline"
                      value={profile.tagline}
                      onChange={handleChange}
                      placeholder="A short introduction to your company"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Field
                      label="Company website"
                      name="website"
                      value={profile.website}
                      onChange={handleChange}
                      placeholder="https://yourcompany.com"
                      type="url"
                    />

                    {errors.website && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.website}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Field
                      label="Company location"
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      placeholder="City, State, Country"
                    />
                  </div>
                </div>
              </section>

              {/* Company description */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    About the company
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Explain your mission, products and work culture.
                  </p>
                </div>

                <label className="mt-5 block">
                  <span className="text-sm font-semibold text-slate-700">
                    Company description
                  </span>

                  <textarea
                    name="description"
                    value={profile.description}
                    onChange={handleChange}
                    rows={7}
                    maxLength={2000}
                    placeholder="Tell candidates what makes your company unique..."
                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  />

                  <span className="mt-1.5 block text-right text-xs text-slate-400">
                    {profile.description.length}/2000 characters
                  </span>
                </label>
              </section>

              {/* Company details */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Company details
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Help candidates understand your organization.
                  </p>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">
                      Company size
                    </span>

                    <select
                      name="size"
                      value={profile.size}
                      onChange={handleChange}
                      className={fieldClass}
                    >
                      {companySizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </label>

                  <Field
                    label="Year founded"
                    name="founded"
                    value={profile.founded}
                    onChange={handleChange}
                    placeholder="e.g. 2020"
                  />

                  <div className="sm:col-span-2">
                    <Field
                      label="Recruitment contact email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="careers@yourcompany.com"
                      type="email"
                    />
                  </div>
                </div>
              </section>

              {/* Online presence */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Online presence
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add links where candidates can learn more about you.
                  </p>
                </div>

                <div className="mt-5">
                  <label className="block">
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-700 text-xs font-bold text-white">
                        in
                      </span>
                      LinkedIn company URL
                    </span>

                    <input
                      type="url"
                      name="linkedin"
                      value={profile.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/company/..."
                      className={fieldClass}
                    />

                    {errors.linkedin && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.linkedin}
                      </p>
                    )}
                  </label>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="font-bold text-slate-900">
                  Company logo
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Paste a publicly accessible image URL to preview your logo.
                </p>

                <label className="mt-4 block">
                  <span className="text-sm font-semibold text-slate-700">
                    Logo image URL
                  </span>

                  <input
                    type="url"
                    name="logoUrl"
                    value={profile.logoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className={fieldClass}
                  />

                  {errors.logoUrl && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.logoUrl}
                    </p>
                  )}
                </label>

                <div className="mt-4 flex items-center gap-2 text-xs leading-5 text-slate-400">
                  <Upload size={15} />
                  Image upload can be connected to the backend later.
                </div>
              </section>

              <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                <h2 className="font-bold text-slate-900">
                  Profile checklist
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Complete these details to help candidates learn about your
                  organization.
                </p>

                <div className="mt-4 space-y-3">
                  {checklist.map(([label, complete]) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          complete
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-white text-slate-400"
                        }`}
                      >
                        {complete && <CheckCircle2 size={14} />}
                      </span>

                      <span
                        className={
                          complete ? "text-slate-700" : "text-slate-500"
                        }
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="font-bold text-slate-900">
                  Before publishing
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Make sure your company details and recruitment contact
                  information are accurate.
                </p>
              </section>
            </aside>
          </div>

          {/* Save action */}
          {errors.form && (
            <p
              role="alert"
              className="mb-3 mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {errors.form}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="text-sm text-slate-500">
              {saved ? (
                <span className="inline-flex items-center gap-2 font-semibold text-emerald-700">
                  <CheckCircle2 size={17} />
                  Changes saved in this browser.
                </span>
              ) : (
                "Review your company information before saving."
              )}
            </div>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Save size={17} />
              Save company profile
            </button>
          </div>
        </form>

        <p className="mt-4 text-xs leading-5 text-slate-400">
          Demo storage: profile changes persist in this browser. Connect a
          backend API for shared company data across devices and users.
        </p>
      </div>
    </main>
  );
}
