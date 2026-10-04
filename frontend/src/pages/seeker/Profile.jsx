
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const STORAGE_PREFIX = "careerflow_profile_v1";
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const MAX_RESUME_SIZE = 1024 * 1024;

const today = new Date();
const todayISO = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0"),
].join("-");

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  location: "",
  title: "",
  about: "",
  photo: "",
  resume: null,
  skills: [],
  experience: [],
  education: [],
};

const inputClass =
  "mt-1.5 block w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-[#172b4d] outline-none transition placeholder:text-slate-400 focus:border-[#0066b3] focus:ring-4 focus:ring-blue-50";

const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#0066b3] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#005493] disabled:cursor-not-allowed disabled:opacity-50";

const buttonSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50";

function getStorageKey(user) {
  return `${STORAGE_PREFIX}_${user?.id || user?.email || "guest"}`;
}

function readProfile(user) {
  try {
    const stored = localStorage.getItem(getStorageKey(user));

    if (stored) {
      return { ...emptyProfile, ...JSON.parse(stored) };
    }
  } catch {
    // Invalid or unavailable stored data: use safe defaults.
  }

  return {
    ...emptyProfile,
    name: user?.name || "",
    email: user?.email || "",
  };
}

function formatDate(value) {
  if (!value) return "";

  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function parseDate(value) {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }

  return `${year}-${month}-${day}`;
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function DatePicker({ label, value, onChange, max, required = false }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => {
    const date = value ? new Date(`${value}T12:00:00`) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const [text, setText] = useState(formatDate(value));
  const [error, setError] = useState("");

  useEffect(() => {
    setText(formatDate(value));
  }, [value]);

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const maxDate = max ? new Date(`${max}T12:00:00`) : null;

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const chooseDay = (day) => {
    const date = new Date(year, monthIndex, day);
    const iso = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    if (max && iso > max) return;

    onChange(iso);
    setText(formatDate(iso));
    setError("");
    setOpen(false);
  };

  const changeText = (nextText) => {
    setText(nextText);
    setError("");

    if (!nextText.trim()) {
      onChange("");
      return;
    }

    const parsed = parseDate(nextText);

    if (parsed && (!max || parsed <= max)) {
      onChange(parsed);
    }
  };

  const validateText = () => {
    if (!text.trim()) {
      if (required) setError("Please select a date.");
      else onChange("");
      return;
    }

    const parsed = parseDate(text);

    if (!parsed) {
      setError("Enter a valid date in DD/MM/YYYY format.");
    } else if (max && parsed > max) {
      setError("This date cannot be in the future.");
    } else {
      onChange(parsed);
      setText(formatDate(parsed));
      setError("");
    }
  };

  return (
    <div className="min-w-0">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative mt-1.5">
        <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-white transition focus-within:border-[#0066b3] focus-within:ring-4 focus-within:ring-blue-50">
          <input
            value={text}
            onChange={(event) => changeText(event.target.value)}
            onBlur={validateText}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                validateText();
                setOpen(true);
              }

              if (event.key === "Escape") setOpen(false);
            }}
            placeholder="DD/MM/YYYY"
            inputMode="numeric"
            maxLength={10}
            aria-label={label}
            aria-invalid={Boolean(error)}
            className="h-full min-w-0 flex-1 rounded-l-xl bg-transparent px-3.5 text-sm text-[#172b4d] outline-none placeholder:text-slate-400"
          />

          <button
            type="button"
            onClick={() => {
              const current = value
                ? new Date(`${value}T12:00:00`)
                : new Date();

              setMonth(new Date(current.getFullYear(), current.getMonth(), 1));
              setOpen((currentOpen) => !currentOpen);
            }}
            aria-label={`Open ${label} calendar`}
            className="mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#0066b3] transition hover:bg-blue-50"
          >
            <CalendarDays size={19} />
          </button>
        </div>

        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

        {open && (
          <div className="absolute left-0 top-full z-50 mt-2 w-[min(320px,calc(100vw-48px))] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  setMonth(new Date(year, monthIndex - 1, 1))
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex flex-1 items-center justify-center gap-2">
                <select
                  aria-label="Select month"
                  value={monthIndex}
                  onChange={(event) =>
                    setMonth(
                      new Date(year, Number(event.target.value), 1),
                    )
                  }
                  className="max-w-[145px] rounded-lg border border-slate-200 px-2 py-2 text-sm font-semibold"
                >
                  {Array.from({ length: 12 }, (_, index) => (
                    <option key={index} value={index}>
                      {new Date(2000, index, 1).toLocaleString("en", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Select year"
                  value={year}
                  onChange={(event) =>
                    setMonth(
                      new Date(Number(event.target.value), monthIndex, 1),
                    )
                  }
                  className="rounded-lg border border-slate-200 px-2 py-2 text-sm font-semibold"
                >
                  {Array.from(
                    { length: 81 },
                    (_, index) => today.getFullYear() - 80 + index,
                  )
                    .filter(
                      (itemYear) =>
                        !maxDate || itemYear <= maxDate.getFullYear(),
                    )
                    .reverse()
                    .map((itemYear) => (
                      <option key={itemYear} value={itemYear}>
                        {itemYear}
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="button"
                disabled={
                  Boolean(maxDate) &&
                  new Date(year, monthIndex + 1, 1) >
                    new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
                }
                onClick={() =>
                  setMonth(new Date(year, monthIndex + 1, 1))
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-30"
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-7 text-center text-xs font-semibold text-slate-400">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {calendarDays.map((day, index) => {
                const iso = day
                  ? [
                      year,
                      String(monthIndex + 1).padStart(2, "0"),
                      String(day).padStart(2, "0"),
                    ].join("-")
                  : "";

                const disabled = Boolean(day && max && iso > max);
                const selected = Boolean(day && iso === value);

                return (
                  <button
                    key={`${year}-${monthIndex}-${index}`}
                    type="button"
                    disabled={!day || disabled}
                    onClick={() => day && chooseDay(day)}
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl text-sm transition ${
                      selected
                        ? "bg-[#0066b3] font-bold text-white"
                        : "text-slate-700 hover:bg-blue-50 hover:text-[#0066b3]"
                    } disabled:cursor-not-allowed disabled:text-slate-300`}
                  >
                    {day || ""}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setText("");
                  setError("");
                  setOpen(false);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-red-600"
              >
                Clear date
              </button>

              <button
                type="button"
                onClick={() => {
                  setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                  chooseDay(today.getDate());
                }}
                disabled={Boolean(max && todayISO > max)}
                className="text-xs font-bold text-[#0066b3] disabled:opacity-40"
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", ...props }) {
  return (
    <label className="block min-w-0 text-sm font-semibold text-slate-700">
      {label}
      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
        {...props}
      />
    </label>
  );
}

function SectionCard({ title, icon: Icon, action, children }) {
  return (
    <section className="min-w-0 overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">
            <Icon size={18} />
          </div>
          <h2 className="font-bold text-[#172b4d]">{title}</h2>
        </div>

        {action}
      </div>

      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center">
      <p className="text-sm font-semibold text-slate-600">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const photoInput = useRef(null);
  const resumeInput = useRef(null);

  const [profile, setProfile] = useState(() => readProfile(user));
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => readProfile(user));
  const [skillInput, setSkillInput] = useState("");
  const [experienceEditor, setExperienceEditor] = useState(null);
  const [educationEditor, setEducationEditor] = useState(null);

  useEffect(() => {
    const next = readProfile(user);
    setProfile(next);
    setForm(next);
    setEditing(false);
    setExperienceEditor(null);
    setEducationEditor(null);
  }, [user?.id, user?.email]);

  const profileCompletion = useMemo(() => {
    const checks = [
      Boolean(profile.name.trim()),
      Boolean(profile.email.trim()),
      Boolean(profile.phone.trim()),
      Boolean(profile.dob),
      Boolean(profile.location.trim()),
      Boolean(profile.title.trim()),
      Boolean(profile.about.trim()),
      Boolean(profile.photo),
      Boolean(profile.resume),
      profile.skills.length > 0,
      profile.experience.length > 0,
      profile.education.length > 0,
    ];

    return Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );
  }, [profile]);

  const persistProfile = (next) => {
    try {
      localStorage.setItem(getStorageKey(user), JSON.stringify(next));
      setProfile(next);
      setForm(next);
      return true;
    } catch {
      toast.error(
        "Browser storage is full. Remove a large file and try again.",
      );
      return false;
    }
  };

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const savePersonalInfo = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (form.dob && form.dob > todayISO) {
      toast.error("Date of birth cannot be in the future.");
      return;
    }

    const next = {
      ...profile,
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      title: form.title.trim(),
      location: form.location.trim(),
      about: form.about.trim(),
    };

    if (persistProfile(next)) {
      setEditing(false);
      toast.success("Personal information saved.");
    }
  };

  const uploadPhoto = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > MAX_PHOTO_SIZE) {
      toast.error("Photo must be smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => toast.error("Could not read this image.");

    reader.onload = () => {
      const image = new Image();

      image.onerror = () => toast.error("This image could not be opened.");

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, 600 / Math.max(image.width, image.height));

        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext("2d");

        if (!context) {
          toast.error("Photo processing is not supported.");
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const photo = canvas.toDataURL("image/jpeg", 0.82);
        const next = { ...profile, photo };

        if (persistProfile(next)) {
          toast.success("Profile photo updated.");
        }
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  const uploadResume = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Please upload your resume as a PDF.");
      return;
    }

    if (file.size > MAX_RESUME_SIZE) {
      toast.error("For this browser-only version, PDF size must be 1 MB or less.");
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => toast.error("Could not read the resume.");

    reader.onload = () => {
      const resume = {
        name: file.name,
        data: reader.result,
        size: file.size,
        updatedAt: new Date().toISOString(),
      };

      if (persistProfile({ ...profile, resume })) {
        toast.success("Resume uploaded successfully.");
      }
    };

    reader.readAsDataURL(file);
  };

  const removeResume = () => {
    if (!window.confirm("Remove your uploaded resume?")) return;

    if (persistProfile({ ...profile, resume: null })) {
      toast.success("Resume removed.");
    }
  };

  const addSkill = (event) => {
    event.preventDefault();
    const skill = skillInput.trim();

    if (!skill) {
      toast.error("Enter a skill first.");
      return;
    }

    if (
      profile.skills.some(
        (item) => item.toLowerCase() === skill.toLowerCase(),
      )
    ) {
      toast.error("This skill is already added.");
      return;
    }

    if (persistProfile({ ...profile, skills: [...profile.skills, skill] })) {
      setSkillInput("");
      toast.success("Skill added.");
    }
  };

  const removeSkill = (skill) => {
    if (
      persistProfile({
        ...profile,
        skills: profile.skills.filter((item) => item !== skill),
      })
    ) {
      toast.success("Skill removed.");
    }
  };

  const saveExperience = (event) => {
    event.preventDefault();
    const item = experienceEditor;

    if (!item.role.trim() || !item.company.trim()) {
      toast.error("Job title and company are required.");
      return;
    }

    if (item.startDate && item.endDate && item.endDate < item.startDate) {
      toast.error("End date cannot be before start date.");
      return;
    }

    const savedItem = {
      ...item,
      role: item.role.trim(),
      company: item.company.trim(),
      description: item.description.trim(),
      duration: item.current
        ? `${formatDate(item.startDate)} - Present`
        : `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`,
    };

    const exists = profile.experience.some((entry) => entry.id === item.id);

    const experience = exists
      ? profile.experience.map((entry) =>
          entry.id === item.id ? savedItem : entry,
        )
      : [...profile.experience, savedItem];

    if (persistProfile({ ...profile, experience })) {
      setExperienceEditor(null);
      toast.success(exists ? "Experience updated." : "Experience added.");
    }
  };

  const deleteExperience = (id) => {
    if (!window.confirm("Delete this experience entry?")) return;

    if (
      persistProfile({
        ...profile,
        experience: profile.experience.filter((item) => item.id !== id),
      })
    ) {
      toast.success("Experience deleted.");
    }
  };

  const saveEducation = (event) => {
    event.preventDefault();
    const item = educationEditor;

    if (!item.degree.trim() || !item.institute.trim()) {
      toast.error("Degree and institution are required.");
      return;
    }

    if (item.startDate && item.endDate && item.endDate < item.startDate) {
      toast.error("End date cannot be before start date.");
      return;
    }

    const savedItem = {
      ...item,
      degree: item.degree.trim(),
      institute: item.institute.trim(),
      field: item.field.trim(),
      year: `${formatDate(item.startDate)} - ${
        item.current ? "Present" : formatDate(item.endDate)
      }`,
    };

    const exists = profile.education.some((entry) => entry.id === item.id);

    const education = exists
      ? profile.education.map((entry) =>
          entry.id === item.id ? savedItem : entry,
        )
      : [...profile.education, savedItem];

    if (persistProfile({ ...profile, education })) {
      setEducationEditor(null);
      toast.success(exists ? "Education updated." : "Education added.");
    }
  };

  const deleteEducation = (id) => {
    if (!window.confirm("Delete this education entry?")) return;

    if (
      persistProfile({
        ...profile,
        education: profile.education.filter((item) => item.id !== id),
      })
    ) {
      toast.success("Education deleted.");
    }
  };

  const newExperience = () =>
    setExperienceEditor({
      id: createId(),
      role: "",
      company: "",
      employmentType: "Full-time",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });

  const newEducation = () =>
    setEducationEditor({
      id: createId(),
      degree: "",
      institute: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });

  const initials = profile.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

  const downloadResume = () => {
    if (!profile.resume?.data) return;

    const link = document.createElement("a");
    link.href = profile.resume.data;
    link.download = profile.resume.name || "resume.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0066b3]">
            My Profile
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#172b4d]">
            Profile & Resume
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Build a complete professional profile to improve your job opportunities.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-20 bg-gradient-to-r from-[#10243e] to-[#0066b3]" />

              <div className="-mt-11 px-4 pb-5">
                <div className="relative w-fit">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-blue-50 text-2xl font-black text-[#0066b3] shadow-sm">
                    {profile.photo ? (
                      <img
                        src={profile.photo}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => photoInput.current?.click()}
                    aria-label="Change profile photo"
                    title="Change profile photo"
                    className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-[#0066b3] text-white transition hover:bg-[#005493]"
                  >
                    <Camera size={15} />
                  </button>

                  <input
                    ref={photoInput}
                    type="file"
                    accept="image/*"
                    onChange={uploadPhoto}
                    className="hidden"
                  />
                </div>

                <h2 className="mt-4 break-words text-lg font-black text-[#172b4d]">
                  {profile.name || "Your Name"}
                </h2>
                <p className="mt-1 break-words text-sm font-semibold text-[#0066b3]">
                  {profile.title || "Add your professional title"}
                </p>

                <div className="mt-5 space-y-3 text-sm text-slate-500">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <Mail size={15} className="mt-0.5 shrink-0" />
                    <span className="break-all">{profile.email || "Add email"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Phone size={15} className="mt-0.5 shrink-0" />
                    <span className="break-words">{profile.phone || "Add phone number"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin size={15} className="mt-0.5 shrink-0" />
                    <span className="break-words">{profile.location || "Add location"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CalendarDays size={15} className="mt-0.5 shrink-0" />
                    <span>DOB: {formatDate(profile.dob) || "Not added"}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setForm(profile);
                    setEditing(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`${buttonSecondary} mt-5 w-full`}
                >
                  <Edit3 size={15} />
                  Edit Profile
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-[#172b4d]">Profile strength</h3>
                  <p className="mt-1 text-xs text-slate-500">Complete more details to stand out.</p>
                </div>
                <span className="text-lg font-black text-[#0066b3]">
                  {profileCompletion}%
                </span>
              </div>

              <div
                className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-valuenow={profileCompletion}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-[#0066b3] transition-all"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>

              <div className="mt-4 space-y-2.5 text-xs">
                {[
                  ["Personal information", Boolean(profile.name && profile.email && profile.phone)],
                  ["Profile photo", Boolean(profile.photo)],
                  ["Resume uploaded", Boolean(profile.resume)],
                  ["Skills added", profile.skills.length > 0],
                  ["Experience added", profile.experience.length > 0],
                  ["Education added", profile.education.length > 0],
                ].map(([label, complete]) => (
                  <div key={label} className="flex items-center gap-2">
                    {complete ? (
                      <Check size={14} className="text-emerald-600" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    )}
                    <span className={complete ? "text-emerald-700" : "text-slate-500"}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">
                  <FileText size={19} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-[#172b4d]">Resume</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    PDF format, up to 1 MB in browser-only mode.
                  </p>
                </div>
              </div>

              <input
                ref={resumeInput}
                type="file"
                accept=".pdf,application/pdf"
                onChange={uploadResume}
                className="hidden"
              />

              {profile.resume ? (
                <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                  <div className="flex items-start gap-2">
                    <FileText size={18} className="mt-0.5 shrink-0 text-[#0066b3]" />
                    <p className="min-w-0 flex-1 break-all text-xs font-semibold text-[#172b4d]">
                      {profile.resume.name}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={downloadResume}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066b3]"
                    >
                      <Download size={14} />
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => resumeInput.current?.click()}
                      className="text-xs font-bold text-slate-600"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={removeResume}
                      className="text-xs font-bold text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => resumeInput.current?.click()}
                  className={`${buttonSecondary} mt-4 w-full`}
                >
                  <Upload size={15} />
                  Upload Resume
                </button>
              )}
            </section>
          </aside>

          <div className="min-w-0 space-y-5">
            <SectionCard
              title="Personal Information"
              icon={UserRound}
              action={
                !editing && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm(profile);
                      setEditing(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-semibold text-[#0066b3] hover:bg-blue-50"
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>
                )
              }
            >
              {editing ? (
                <form onSubmit={savePersonalInfo} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Full Name"
                      value={form.name}
                      onChange={(value) => updateForm("name", value)}
                      placeholder="Your full name"
                      required
                    />
                    <Field
                      label="Professional Title"
                      value={form.title}
                      onChange={(value) => updateForm("title", value)}
                      placeholder="e.g. Backend Developer"
                    />
                    <Field
                      label="Email Address"
                      type="email"
                      value={form.email}
                      onChange={(value) => updateForm("email", value)}
                      placeholder="you@example.com"
                      required
                    />
                    <Field
                      label="Phone Number"
                      type="tel"
                      value={form.phone}
                      onChange={(value) => updateForm("phone", value)}
                      placeholder="+91..."
                    />
                    <DatePicker
                      label="Date of Birth"
                      value={form.dob}
                      max={todayISO}
                      onChange={(value) => updateForm("dob", value)}
                    />
                    <Field
                      label="Location"
                      value={form.location}
                      onChange={(value) => updateForm("location", value)}
                      placeholder="City, State, Country"
                    />
                  </div>

                  <label className="block text-sm font-semibold text-slate-700">
                    About
                    <textarea
                      value={form.about}
                      onChange={(event) => updateForm("about", event.target.value)}
                      rows={4}
                      maxLength={2000}
                      placeholder="Describe your experience, strengths and career goals..."
                      className={`${inputClass} resize-y`}
                    />
                    <span className="mt-1 block text-right text-xs font-normal text-slate-400">
                      {form.about.length}/2000
                    </span>
                  </label>

                  <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setForm(profile);
                        setEditing(false);
                      }}
                      className={buttonSecondary}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={buttonPrimary}>
                      <Save size={15} />
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  {[
                    ["Full Name", profile.name],
                    ["Professional Title", profile.title],
                    ["Email", profile.email],
                    ["Phone", profile.phone],
                    ["Date of Birth", formatDate(profile.dob)],
                    ["Location", profile.location],
                  ].map(([label, value]) => (
                    <div key={label} className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {label}
                      </p>
                      <p className="mt-1.5 break-words text-sm font-semibold text-[#172b4d]">
                        {value || "Not added"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="About" icon={UserRound}>
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {profile.about || "Add a short professional summary using Edit Profile."}
              </p>
            </SectionCard>

            <SectionCard title="Skills" icon={Award}>
              <form onSubmit={addSkill} className="mb-4 flex flex-col gap-2 sm:flex-row">
                <input
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  placeholder="Add a skill, e.g. Node.js"
                  maxLength={60}
                  className={`${inputClass} mt-0 flex-1`}
                />
                <button type="submit" className={buttonPrimary}>
                  <Plus size={16} />
                  Add Skill
                </button>
              </form>

              {profile.skills.length ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex max-w-full items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-[#0066b3]"
                    >
                      <span className="break-words">{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        aria-label={`Remove ${skill}`}
                        title={`Remove ${skill}`}
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-blue-500 hover:bg-red-100 hover:text-red-600"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyState title="No skills added" description="Add your technical and professional skills." />
              )}
            </SectionCard>

            <SectionCard
              title="Experience"
              icon={BriefcaseBusiness}
              action={
                <button type="button" onClick={newExperience} className={buttonPrimary}>
                  <Plus size={15} />
                  Add
                </button>
              }
            >
              {profile.experience.length ? (
                <div className="space-y-5">
                  {profile.experience.map((item) => (
                    <article key={item.id} className="flex gap-3">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">
                        <BriefcaseBusiness size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-bold text-[#172b4d]">{item.role}</h3>
                        <p className="mt-1 break-words text-sm font-semibold text-[#0066b3]">
                          {item.company}
                        </p>
                        {item.location && <p className="mt-1 text-xs text-slate-500">{item.location}</p>}
                        <p className="mt-1 text-xs text-slate-500">
                          {item.duration || `${formatDate(item.startDate)} - ${item.current ? "Present" : formatDate(item.endDate)}`}
                          {item.employmentType ? ` · ${item.employmentType}` : ""}
                        </p>
                        {item.description && (
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.description}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => setExperienceEditor({
                            employmentType: "Full-time",
                            current: false,
                            ...item,
                          })}
                          aria-label="Edit experience"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-[#0066b3]"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteExperience(item.id)}
                          aria-label="Delete experience"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState title="No experience added" description="Add your current or previous job experience." />
              )}
            </SectionCard>

            <SectionCard
              title="Education"
              icon={GraduationCap}
              action={
                <button type="button" onClick={newEducation} className={buttonPrimary}>
                  <Plus size={15} />
                  Add
                </button>
              }
            >
              {profile.education.length ? (
                <div className="space-y-5">
                  {profile.education.map((item) => (
                    <article key={item.id} className="flex gap-3">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">
                        <GraduationCap size={19} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-bold text-[#172b4d]">{item.degree}</h3>
                        <p className="mt-1 break-words text-sm text-slate-600">{item.institute}</p>
                        {item.field && <p className="mt-1 text-xs text-slate-500">{item.field}</p>}
                        <p className="mt-1 text-xs text-slate-500">
                          {item.year || `${formatDate(item.startDate)} - ${item.current ? "Present" : formatDate(item.endDate)}`}
                        </p>
                        {item.description && (
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.description}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => setEducationEditor({
                            current: false,
                            ...item,
                          })}
                          aria-label="Edit education"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-[#0066b3]"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteEducation(item.id)}
                          aria-label="Delete education"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState title="No education added" description="Add your degree, institution and study dates." />
              )}
            </SectionCard>
          </div>
        </div>
      </main>

      {experienceEditor && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/50 p-3 py-8 sm:p-6">
          <section className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-black text-[#172b4d]">
                {profile.experience.some((item) => item.id === experienceEditor.id)
                  ? "Edit Experience"
                  : "Add Experience"}
              </h2>
              <button type="button" onClick={() => setExperienceEditor(null)} aria-label="Close" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X size={19} />
              </button>
            </div>

            <form onSubmit={saveExperience} className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Job Title" value={experienceEditor.role} onChange={(value) => setExperienceEditor((item) => ({ ...item, role: value }))} placeholder="e.g. Backend Developer" required />
                <Field label="Company" value={experienceEditor.company} onChange={(value) => setExperienceEditor((item) => ({ ...item, company: value }))} placeholder="Company name" required />
                <label className="block text-sm font-semibold text-slate-700">
                  Employment Type
                  <select value={experienceEditor.employmentType} onChange={(event) => setExperienceEditor((item) => ({ ...item, employmentType: event.target.value }))} className={inputClass}>
                    {["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Temporary"].map((value) => <option key={value}>{value}</option>)}
                  </select>
                </label>
                <Field label="Location" value={experienceEditor.location} onChange={(value) => setExperienceEditor((item) => ({ ...item, location: value }))} placeholder="City or Remote" />
                <DatePicker label="Start Date" value={experienceEditor.startDate} max={todayISO} onChange={(value) => setExperienceEditor((item) => ({ ...item, startDate: value, endDate: item.endDate && item.endDate < value ? "" : item.endDate }))} required />
                {!experienceEditor.current && (
                  <DatePicker label="End Date" value={experienceEditor.endDate} max={todayISO} onChange={(value) => setExperienceEditor((item) => ({ ...item, endDate: value }))} />
                )}
              </div>

              <label className="flex items-center gap-2.5 text-sm font-medium text-slate-600">
                <input type="checkbox" checked={experienceEditor.current} onChange={(event) => setExperienceEditor((item) => ({ ...item, current: event.target.checked, endDate: "" }))} className="h-4 w-4 accent-[#0066b3]" />
                I currently work here
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Description
                <textarea value={experienceEditor.description} onChange={(event) => setExperienceEditor((item) => ({ ...item, description: event.target.value }))} rows={4} maxLength={2000} placeholder="Responsibilities, achievements and projects..." className={`${inputClass} resize-y`} />
              </label>

              <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => setExperienceEditor(null)} className={buttonSecondary}>Cancel</button>
                <button type="submit" className={buttonPrimary}><Save size={15} /> Save Experience</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {educationEditor && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/50 p-3 py-8 sm:p-6">
          <section className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-black text-[#172b4d]">
                {profile.education.some((item) => item.id === educationEditor.id)
                  ? "Edit Education"
                  : "Add Education"}
              </h2>
              <button type="button" onClick={() => setEducationEditor(null)} aria-label="Close" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X size={19} />
              </button>
            </div>

            <form onSubmit={saveEducation} className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Degree / Qualification" value={educationEditor.degree} onChange={(value) => setEducationEditor((item) => ({ ...item, degree: value }))} placeholder="e.g. Bachelor of Computer Applications" required />
                <Field label="School / College / University" value={educationEditor.institute} onChange={(value) => setEducationEditor((item) => ({ ...item, institute: value }))} placeholder="Institution name" required />
                <Field label="Field of Study" value={educationEditor.field} onChange={(value) => setEducationEditor((item) => ({ ...item, field: value }))} placeholder="e.g. Computer Applications" />
                <DatePicker label="Start Date" value={educationEditor.startDate} max={todayISO} onChange={(value) => setEducationEditor((item) => ({ ...item, startDate: value, endDate: item.endDate && item.endDate < value ? "" : item.endDate }))} />
                {!educationEditor.current && (
                  <DatePicker label="Graduation / End Date" value={educationEditor.endDate} max={todayISO} onChange={(value) => setEducationEditor((item) => ({ ...item, endDate: value }))} />
                )}
              </div>

              <label className="flex items-center gap-2.5 text-sm font-medium text-slate-600">
                <input type="checkbox" checked={educationEditor.current} onChange={(event) => setEducationEditor((item) => ({ ...item, current: event.target.checked, endDate: "" }))} className="h-4 w-4 accent-[#0066b3]" />
                I am currently studying here
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Additional Details
                <textarea value={educationEditor.description} onChange={(event) => setEducationEditor((item) => ({ ...item, description: event.target.value }))} rows={3} maxLength={1500} placeholder="Grades, achievements, coursework..." className={`${inputClass} resize-y`} />
              </label>

              <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => setEducationEditor(null)} className={buttonSecondary}>Cancel</button>
                <button type="submit" className={buttonPrimary}><Save size={15} /> Save Education</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
