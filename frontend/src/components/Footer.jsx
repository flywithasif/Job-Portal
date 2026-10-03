import { BriefcaseBusiness, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#10243e] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0066b3]">
                <BriefcaseBusiness size={21} />
              </div>

              <span className="text-xl font-extrabold">
                Career<span className="text-blue-400">Flow</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
              A modern career platform connecting ambitious professionals
              with companies building the future.
            </p>
          </div>

          <div>
            <h3 className="font-bold">For Job Seekers</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
              <Link to="/jobs" className="hover:text-white">
                Search Jobs
              </Link>

              <Link to="/register" className="hover:text-white">
                Create Profile
              </Link>

              <Link to="/dashboard" className="hover:text-white">
                My Applications
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold">For Employers</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
              <Link to="/register" className="hover:text-white">
                Post a Job
              </Link>

              <Link to="/recruiter" className="hover:text-white">
                Recruiter Dashboard
              </Link>

              <span className="cursor-pointer hover:text-white">
                Hiring Solutions
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Contact</h3>

            <div className="mt-4 space-y-4 text-sm text-slate-300">
              <div className="flex gap-3">
                <MapPin size={18} />
                <span>Gurugram, India</span>
              </div>

              <div className="flex gap-3">
                <Mail size={18} />
                <span>hello@careerflow.com</span>
              </div>

              <div className="flex gap-3">
                <Phone size={18} />
                <span>+91 90000 00000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-7 text-center text-sm text-slate-400">
          © 2026 CareerFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
