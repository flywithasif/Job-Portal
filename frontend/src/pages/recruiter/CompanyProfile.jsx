import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Globe,
  Loader2,
  MapPin,
  Save,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import {
  createCompany,
  getMyCompany,
  updateCompany,
} from "../../services/companyService";

const EMPTY_PROFILE = {
  name: "",
  description: "",
  website: "",
  logo: "",
  industry: "",
  location: "",
  companySize: "",
  foundedYear: "",
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
  {
    value: "1-10",
    label: "1–10 employees",
  },
  {
    value: "11-50",
    label: "11–50 employees",
  },
  {
    value: "51-200",
    label: "51–200 employees",
  },
  {
    value: "201-500",
    label: "201–500 employees",
  },
  {
    value: "501-1000",
    label: "501–1000 employees",
  },
  {
    value: "1000+",
    label: "1000+ employees",
  },
];

const fieldClass =
  "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50";

const textareaClass =
  "mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50";

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  error = "",
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
        disabled={disabled}
        className={fieldClass}
      />

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </label>
  );
}

function getApiMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    fallback
  );
}

function normalizeCompany(company) {
  if (!company) {
    return EMPTY_PROFILE;
  }

  return {
    name: company.name || "",
    description: company.description || "",
    website: company.website || "",
    logo: company.logo || "",
    industry: company.industry || "",
    location: company.location || "",
    companySize: company.companySize || "",
    foundedYear: company.foundedYear
      ? String(company.foundedYear)
      : "",
  };
}

export default function CompanyProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [companyId, setCompanyId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({});
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadCompany = async () => {
      setLoading(true);

      try {
        const response = await getMyCompany();

        if (!mounted) {
          return;
        }

        const company = response?.data?.company || response?.data;

        if (company) {
          setCompanyId(company._id || company.id);
          setProfile(normalizeCompany(company));
          setLogoError(false);
        }
      } catch (error) {
        if (!mounted) {
          return;
        }

        if (error?.response?.status === 404) {
          setCompanyId(null);
          setProfile(EMPTY_PROFILE);
          return;
        }

        toast.error(
          getApiMessage(
            error,
            "Could not load your company profile.",
          ),
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCompany();

    return () => {
      mounted = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
      form: "",
    }));

    if (name === "logo") {
      setLogoError(false);
    }
  }

  function validate() {
    const nextErrors = {};

    const name = profile.name.trim();
    const description = profile.description.trim();
    const website = profile.website.trim();
    const logo = profile.logo.trim();
    const location = profile.location.trim();

    if (!name) {
      nextErrors.name = "Company name is required.";
    } else if (name.length < 2) {
      nextErrors.name =
        "Company name must be at least 2 characters.";
    } else if (name.length > 150) {
      nextErrors.name =
        "Company name cannot exceed 150 characters.";
    }

    if (description.length > 5000) {
      nextErrors.description =
        "Description cannot exceed 5000 characters.";
    }

    if (website && !/^https?:\/\/.+/i.test(website)) {
      nextErrors.website =
        "Website must start with http:// or https://.";
    }

    if (logo && !/^https?:\/\/.+/i.test(logo)) {
      nextErrors.logo =
        "Logo URL must start with http:// or https://.";
    }

    if (location.length > 200) {
      nextErrors.location =
        "Location cannot exceed 200 characters.";
    }

    if (profile.foundedYear) {
      const year = Number(profile.foundedYear);
      const currentYear = new Date().getFullYear();

      if (
        !Number.isInteger(year) ||
        year < 1800 ||
        year > currentYear
      ) {
        nextErrors.foundedYear = `Enter a valid year between 1800 and ${currentYear}.`;
      }
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate();

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSaving(true);

    const payload = {
      name: profile.name.trim(),
      description: profile.description.trim(),
      website: profile.website.trim(),
      logo: profile.logo.trim(),
      industry: profile.industry.trim(),
      location: profile.location.trim(),
      companySize: profile.companySize,
      foundedYear: profile.foundedYear
        ? Number(profile.foundedYear)
        : null,
    };

    try {
      let response;

      if (companyId) {
        response = await updateCompany(companyId, payload);
      } else {
        response = await createCompany(payload);
      }

      const company =
        response?.data?.company || response?.data;

      if (company) {
        setCompanyId(company._id || company.id);
        setProfile(normalizeCompany(company));
      }

      setErrors({});
      setLogoError(false);

      toast.success(
        companyId
          ? "Company profile updated successfully."
          : "Company profile created successfully.",
      );
    } catch (error) {
      const message = getApiMessage(
        error,
        "Could not save company profile.",
      );

      setErrors({
        form: message,
      });

      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  const initials = useMemo(() => {
    return (
      profile.name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase() || "CO"
    );
  }, [profile.name]);

  const checklist = [
    ["Company name", Boolean(profile.name.trim())],
    ["Industry", Boolean(profile.industry.trim())],
    ["Website", Boolean(profile.website.trim())],
    ["Location", Boolean(profile.location.trim())],
    ["Description", Boolean(profile.description.trim())],
    ["Company size", Boolean(profile.companySize)],
    ["Founded year", Boolean(profile.foundedYear)],
  ];

  const completedCount = checklist.filter(
    ([, complete]) => complete,
  ).length;

  const completionPercentage = Math.round(
    (completedCount / checklist.length) * 100,
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-56 rounded-lg bg-slate-200" />
            <div className="h-4 w-96 max-w-full rounded bg-slate-200" />

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="h-36 bg-slate-200" />
              <div className="space-y-4 p-8">
                <div className="h-7 w-64 rounded bg-slate-200" />
                <div className="h-4 w-96 max-w-full rounded bg-slate-200" />
                <div className="h-4 w-72 rounded bg-slate-200" />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="h-[500px] rounded-2xl bg-white" />
              <div className="h-[400px] rounded-2xl bg-white" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
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
            <span>
              {user?.name
                ? `Managed by ${user.name}`
                : "Employer information"}
            </span>
          </div>
        </div>

        {/* Company preview */}
        <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 sm:h-36" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-11 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-blue-50 text-2xl font-bold text-blue-700 shadow-md sm:h-24 sm:w-24">
                  {profile.logo && !logoError ? (
                    <img
                      src={profile.logo}
                      alt={`${profile.name || "Company"} logo`}
                      className="h-full w-full object-cover"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="min-w-0 pb-1">
                  <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                    {profile.name || "Your company name"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {profile.industry || "Add your industry"}
                  </p>
                </div>
              </div>

              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <CheckCircle2 size={14} />
                {companyId ? "Profile active" : "Create profile"}
              </span>
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">
              {profile.description ||
                "Add your company description so candidates can understand your business, products and culture."}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} />
                {profile.location || "Company location"}
              </span>

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 break-all transition hover:text-blue-700"
                >
                  <Globe size={15} />
                  {profile.website}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-6">
              {/* Basic information */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Basic information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    The essential details candidates see about your
                    company.
                  </p>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Company name *"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Your company name"
                    disabled={saving}
                    error={errors.name}
                  />

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">
                      Industry
                    </span>

                    <select
                      name="industry"
                      value={profile.industry}
                      onChange={handleChange}
                      disabled={saving}
                      className={fieldClass}
                    >
                      <option value="">
                        Select industry
                      </option>

                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="sm:col-span-2">
                    <Field
                      label="Company website"
                      name="website"
                      value={profile.website}
                      onChange={handleChange}
                      placeholder="https://yourcompany.com"
                      type="url"
                      disabled={saving}
                      error={errors.website}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Field
                      label="Company location"
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      placeholder="City, State, Country"
                      disabled={saving}
                      error={errors.location}
                    />
                  </div>
                </div>
              </section>

              {/* Description */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
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
                    rows={8}
                    maxLength={5000}
                    disabled={saving}
                    placeholder="Tell candidates what makes your company unique..."
                    className={textareaClass}
                  />

                  <div className="mt-1.5 flex items-center justify-between">
                    {errors.description ? (
                      <p className="text-xs font-medium text-red-600">
                        {errors.description}
                      </p>
                    ) : (
                      <span />
                    )}

                    <span className="text-xs text-slate-400">
                      {profile.description.length}/5000
                    </span>
                  </div>
                </label>
              </section>

              {/* Company details */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
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
                      name="companySize"
                      value={profile.companySize}
                      onChange={handleChange}
                      disabled={saving}
                      className={fieldClass}
                    >
                      <option value="">
                        Select company size
                      </option>

                      {companySizes.map((size) => (
                        <option
                          key={size.value}
                          value={size.value}
                        >
                          {size.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <Field
                    label="Year founded"
                    name="foundedYear"
                    value={profile.foundedYear}
                    onChange={handleChange}
                    placeholder="e.g. 2020"
                    type="number"
                    disabled={saving}
                    error={errors.foundedYear}
                  />
                </div>
              </section>

              {/* Logo */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Company logo
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add a publicly accessible image URL for your
                    company logo.
                  </p>
                </div>

                <div className="mt-5">
                  <Field
                    label="Logo image URL"
                    name="logo"
                    value={profile.logo}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    type="url"
                    disabled={saving}
                    error={errors.logo}
                  />

                  <div className="mt-4 flex items-center gap-2 text-xs leading-5 text-slate-400">
                    <Upload size={15} />
                    <span>
                      Image upload can be connected to Cloudinary
                      later.
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Profile completion
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Complete your profile to give candidates
                      better information.
                    </p>
                  </div>

                  <span className="text-lg font-bold text-blue-700">
                    {completionPercentage}%
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{
                      width: `${completionPercentage}%`,
                    }}
                  />
                </div>

                <div className="mt-5 space-y-3">
                  {checklist.map(([label, complete]) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          complete
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {complete && (
                          <CheckCircle2 size={14} />
                        )}
                      </span>

                      <span
                        className={
                          complete
                            ? "text-slate-700"
                            : "text-slate-500"
                        }
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                <h2 className="font-bold text-slate-900">
                  Recruiter account
                </h2>

                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-slate-500">
                    Account
                  </p>

                  <p className="break-all font-medium text-slate-800">
                    {user?.email || "Recruiter"}
                  </p>
                </div>

                <p className="mt-4 text-xs leading-5 text-slate-500">
                  Your company is linked to the currently logged-in
                  recruiter account. Other recruiters cannot edit
                  your company.
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-bold text-slate-900">
                  Before publishing
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Make sure your company details are accurate before
                  candidates start applying to your jobs.
                </p>
              </section>
            </aside>
          </div>

          {/* Error */}
          {errors.form && (
            <p
              role="alert"
              className="mb-3 mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {errors.form}
            </p>
          )}

          {/* Save */}
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="text-sm text-slate-500">
              {companyId
                ? "Your company profile is connected to the backend."
                : "Create your company profile to start publishing jobs."}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  {companyId
                    ? "Save company profile"
                    : "Create company profile"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}