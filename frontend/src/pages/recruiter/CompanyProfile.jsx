import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Globe,
  Loader2,
  MapPin,
  Save,
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

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50";

const textareaClass =
  "mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50";

function normalizeCompany(company) {
  if (!company) {
    return { ...EMPTY_PROFILE };
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

function getApiMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    fallback
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
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
        className={inputClass}
      />

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </label>
  );
}

export default function CompanyProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    ...EMPTY_PROFILE,
  });

  const [companyId, setCompanyId] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({});

  const [logoError, setLogoError] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    const loadCompany = async () => {
      try {
        setLoading(true);

        const response =
          await getMyCompany();

        if (!mounted) return;

        const company =
          response?.data?.company ||
          response?.data;

        if (company) {
          setCompanyId(
            company._id || company.id,
          );

          setProfile(
            normalizeCompany(company),
          );

          setLogoError(false);
        }
      } catch (error) {
        if (!mounted) return;

        if (
          error?.response?.status === 404
        ) {
          setCompanyId(null);
          setProfile({
            ...EMPTY_PROFILE,
          });
        } else {
          toast.error(
            getApiMessage(
              error,
              "Could not load company profile.",
            ),
          );
        }
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
    const website = profile.website.trim();
    const logo = profile.logo.trim();
    const location =
      profile.location.trim();

    if (!name) {
      nextErrors.name =
        "Company name is required.";
    } else if (name.length < 2) {
      nextErrors.name =
        "Company name must contain at least 2 characters.";
    }

    if (
      website &&
      !/^https?:\/\/.+/i.test(website)
    ) {
      nextErrors.website =
        "Website must start with http:// or https://.";
    }

    if (
      logo &&
      !/^https?:\/\/.+/i.test(logo)
    ) {
      nextErrors.logo =
        "Logo URL must start with http:// or https://.";
    }

    if (location.length > 200) {
      nextErrors.location =
        "Location cannot exceed 200 characters.";
    }

    if (profile.foundedYear) {
      const year = Number(
        profile.foundedYear,
      );

      const currentYear =
        new Date().getFullYear();

      if (
        !Number.isInteger(year) ||
        year < 1800 ||
        year > currentYear
      ) {
        nextErrors.foundedYear =
          `Enter a valid year between 1800 and ${currentYear}.`;
      }
    }

    if (
      profile.description.trim()
        .length > 5000
    ) {
      nextErrors.description =
        "Description cannot exceed 5000 characters.";
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate();

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      toast.error(
        "Please fix the highlighted fields.",
      );
      return;
    }

    const payload = {
      name: profile.name.trim(),
      description:
        profile.description.trim(),
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
      setSaving(true);

      let response;

      if (companyId) {
        response = await updateCompany(
          companyId,
          payload,
        );
      } else {
        response =
          await createCompany(payload);
      }

      const company =
        response?.data?.company ||
        response?.data;

      if (company) {
        setCompanyId(
          company._id || company.id,
        );

        setProfile(
          normalizeCompany(company),
        );
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
    [
      "Company name",
      Boolean(profile.name.trim()),
    ],
    [
      "Industry",
      Boolean(profile.industry),
    ],
    [
      "Website",
      Boolean(profile.website.trim()),
    ],
    [
      "Location",
      Boolean(profile.location.trim()),
    ],
    [
      "Description",
      Boolean(
        profile.description.trim(),
      ),
    ],
    [
      "Company size",
      Boolean(profile.companySize),
    ],
    [
      "Founded year",
      Boolean(profile.foundedYear),
    ],
  ];

  const completedCount =
    checklist.filter(
      ([, complete]) => complete,
    ).length;

  const completionPercentage =
    Math.round(
      (completedCount /
        checklist.length) *
        100,
    );

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[60vh] items-center justify-center gap-3 text-slate-500">
            <Loader2
              size={22}
              className="animate-spin"
            />
            Loading company profile...
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

            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Company profile
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Build a professional employer
              profile that candidates can trust.
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

        {/* Preview */}
        <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 sm:h-36" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-blue-50 text-2xl font-bold text-blue-700 shadow-md sm:h-24 sm:w-24">
                  {profile.logo &&
                  !logoError ? (
                    <img
                      src={profile.logo}
                      alt={`${profile.name || "Company"} logo`}
                      className="h-full w-full object-cover"
                      onError={() =>
                        setLogoError(true)
                      }
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="min-w-0 pb-1">
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    {profile.name ||
                      "Your company name"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {profile.industry ||
                      "Industry not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2
                  size={17}
                  className={
                    completionPercentage === 100
                      ? "text-emerald-500"
                      : "text-slate-300"
                  }
                />

                {completionPercentage}% complete
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Form */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {errors.form && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {errors.form}
                </div>
              )}

              <div>
                <h3 className="font-bold text-[#172b4d]">
                  Company information
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Keep your employer details accurate
                  and up to date.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Company name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="e.g. CareerFlow Technologies"
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
                    className={inputClass}
                  >
                    <option value="">
                      Select industry
                    </option>

                    {industries.map(
                      (industry) => (
                        <option
                          key={industry}
                          value={industry}
                        >
                          {industry}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <Field
                  label="Website"
                  name="website"
                  value={profile.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  error={errors.website}
                />

                <Field
                  label="Logo URL"
                  name="logo"
                  value={profile.logo}
                  onChange={handleChange}
                  placeholder="https://..."
                  error={errors.logo}
                />

                <Field
                  label="Location"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  placeholder="Gurugram, Haryana"
                  error={errors.location}
                />

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Company size
                  </span>

                  <select
                    name="companySize"
                    value={profile.companySize}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">
                      Select company size
                    </option>

                    {companySizes.map(
                      (size) => (
                        <option
                          key={size.value}
                          value={size.value}
                        >
                          {size.label}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <Field
                  label="Founded year"
                  name="foundedYear"
                  value={profile.foundedYear}
                  onChange={handleChange}
                  placeholder="2020"
                  type="number"
                  error={errors.foundedYear}
                />

                <div className="flex items-end">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={16} />
                    Employer location
                  </div>
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Company description
                </span>

                <textarea
                  name="description"
                  value={profile.description}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Tell candidates about your company, culture, products and mission..."
                  className={textareaClass}
                />

                {errors.description && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.description}
                  </p>
                )}
              </label>

              <div className="flex justify-end border-t border-slate-100 pt-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0066b3] px-6 text-sm font-bold text-white hover:bg-[#005596] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={17} />
                  )}

                  {saving
                    ? "Saving..."
                    : companyId
                      ? "Save changes"
                      : "Create company profile"}
                </button>
              </div>
            </form>
          </section>

          {/* Completion */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-[#172b4d]">
              Profile completion
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#0066b3] transition-all"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />
            </div>

            <p className="mt-3 text-sm text-slate-500">
              {completedCount} of{" "}
              {checklist.length} important fields
              completed.
            </p>

            <div className="mt-5 space-y-3">
              {checklist.map(
                ([label, complete]) => (
                  <div
                    key={label}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2
                      size={17}
                      className={
                        complete
                          ? "text-emerald-500"
                          : "text-slate-200"
                      }
                    />

                    <span
                      className={`text-sm ${
                        complete
                          ? "text-slate-700"
                          : "text-slate-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ),
              )}
            </div>

            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0066b3] hover:underline"
              >
                <Globe size={16} />
                Visit website
              </a>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}