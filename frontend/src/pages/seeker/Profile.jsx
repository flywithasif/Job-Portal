import { useState } from "react";
import {
  Camera,
  Check,
  Edit3,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  User,
  BriefcaseBusiness,
  FileText,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";

const initialProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+91 98765 43210",
  location: "Gurugram, Haryana",
  title: "Frontend Developer",
  about:
    "Passionate frontend developer focused on building clean, scalable and user-friendly web applications. Experienced with React, JavaScript and modern frontend technologies.",
  skills: [
    "React",
    "JavaScript",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Git",
  ],
  education: [
    {
      degree: "Bachelor of Computer Applications",
      institute: "ABC University",
      year: "2024 - 2027",
    },
  ],
  experience: [
    {
      role: "Frontend Developer",
      company: "Tech Solutions",
      duration: "2024 - Present",
    },
  ],
};

function SectionCard({ title, icon: Icon, children, onEdit }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Icon size={18} />
          </div>

          <h2 className="font-semibold text-slate-900">{title}</h2>
        </div>

        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
          >
            <Edit3 size={15} />
            Edit
          </button>
        )}
      </div>

      <div className="p-5">{children}</div>
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState(initialProfile);

  const profileCompletion = 82;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setProfile(form);
    setEditing(false);

    toast.success("Profile updated successfully");
  };

  const handleAddSkill = () => {
    const skill = window.prompt("Enter skill name");

    if (!skill?.trim()) return;

    if (profile.skills.includes(skill.trim())) {
      toast.error("Skill already exists");
      return;
    }

    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, skill.trim()],
    }));

    toast.success("Skill added");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-medium text-blue-600">My Profile</p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Profile & Resume
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Keep your professional profile updated to get better job
              opportunities.
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left Profile Card */}
          <aside className="space-y-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-700" />

              <div className="-mt-12 px-5 pb-5">
                <div className="relative w-fit">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-100 text-3xl font-bold text-blue-600 shadow-md">
                    AJ
                  </div>

                  <button
                    className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-sm transition hover:bg-blue-700"
                    title="Change profile photo"
                  >
                    <Camera size={15} />
                  </button>
                </div>

                <div className="mt-4">
                  <h2 className="text-xl font-bold text-slate-900">
                    {profile.name}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-blue-600">
                    {profile.title}
                  </p>
                </div>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-slate-400" />
                    <span className="truncate">{profile.email}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-slate-400" />
                    <span>{profile.phone}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-slate-400" />
                    <span>{profile.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Completion */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Profile strength
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Complete your profile to improve visibility.
                  </p>
                </div>

                <span className="text-lg font-bold text-blue-600">
                  {profileCompletion}%
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Check size={14} />
                  Basic information
                </div>

                <div className="flex items-center gap-2 text-emerald-600">
                  <Check size={14} />
                  Skills added
                </div>

                <div className="flex items-center gap-2 text-amber-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Resume missing
                </div>
              </div>
            </div>

            {/* Resume */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText size={19} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900">
                    Resume
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Upload your latest resume to apply faster.
                  </p>
                </div>
              </div>

              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100">
                <Plus size={16} />
                Upload Resume
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <section className="space-y-5">
            {/* Personal Information */}
            <SectionCard
              title="Personal Information"
              icon={User}
              onEdit={() => {
                setForm(profile);
                setEditing(true);
              }}
            >
              {!editing ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Full Name
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {profile.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Professional Title
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {profile.title}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {profile.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {profile.phone}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Location
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {profile.location}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Full Name
                      </label>

                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Professional Title
                      </label>

                      <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Email
                      </label>

                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Phone
                      </label>

                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Location
                    </label>

                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setEditing(false)}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      <Save size={16} />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </SectionCard>

            {/* About */}
            <SectionCard title="About" icon={User}>
              <p className="text-sm leading-7 text-slate-600">
                {profile.about}
              </p>
            </SectionCard>

            {/* Skills */}
            <SectionCard title="Skills" icon={Award}>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                ))}

                <button
                  onClick={handleAddSkill}
                  className="flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Plus size={15} />
                  Add Skill
                </button>
              </div>
            </SectionCard>

            {/* Experience */}
            <SectionCard title="Experience" icon={BriefcaseBusiness}>
              <div className="space-y-5">
                {profile.experience.map((item) => (
                  <div
                    key={`${item.role}-${item.company}`}
                    className="relative border-l-2 border-blue-100 pl-5"
                  >
                    <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-blue-600 bg-white" />

                    <h3 className="font-semibold text-slate-900">
                      {item.role}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {item.company}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.duration}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Education */}
            <SectionCard title="Education" icon={GraduationCap}>
              <div className="space-y-5">
                {profile.education.map((item) => (
                  <div
                    key={`${item.degree}-${item.institute}`}
                    className="flex gap-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <GraduationCap size={20} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.degree}
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        {item.institute}
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-400">
                        {item.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </section>
        </div>
      </main>
    </div>
  );
}