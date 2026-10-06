import {



  ArrowUpRight,



  Bookmark,



  BriefcaseBusiness,



  CalendarDays,



  CheckCircle2,



  Clock3,



  FileText,



  MapPin,



  Search,



} from "lucide-react";



import { Link } from "react-router-dom";



import { useEffect, useMemo, useState } from "react";



import toast from "react-hot-toast";



import { useAuth } from "../../context/AuthContext";



import { getMyApplications } from "../../services/applicationService";



import { getJobs } from "../../services/jobService";

import { getMyInterviews } from "../../services/interviewService";



import { getSavedJobs } from "../../data/seekerStorage";



function formatSalary(min, max) {



  if (min == null && max == null) return "Salary not disclosed";



  const formatAmount = (amount) => {



    const number = Number(amount);



    if (!Number.isFinite(number)) return "";



    if (number >= 10000000) return `₹${(number / 10000000).toFixed(1)}Cr`;



    if (number >= 100000) return `₹${(number / 100000).toFixed(1)}L`;



    if (number >= 1000) return `₹${Math.round(number / 1000)}K`;



    return `₹${number.toLocaleString("en-IN")}`;



  };



  if (min != null && max != null) {



    return `${formatAmount(min)} - ${formatAmount(max)}`;



  }



  return formatAmount(min ?? max);



}



function formatEnum(value) {



  if (!value) return "";



  return String(value)



    .replaceAll("_", " ")



    .toLowerCase()



    .replace(/\b\w/g, (letter) => letter.toUpperCase());



}



function formatRelativeDate(value) {



  if (!value) return "";



  const date = new Date(value);



  if (Number.isNaN(date.getTime())) return "";



  const difference = Date.now() - date.getTime();



  const minutes = Math.floor(difference / (1000 * 60));



  const hours = Math.floor(difference / (1000 * 60 * 60));



  const days = Math.floor(difference / (1000 * 60 * 60 * 24));



  if (minutes < 1) return "Just now";



  if (minutes < 60) return `${minutes}m ago`;



  if (hours < 24) return `${hours}h ago`;



  if (days < 7) return `${days}d ago`;



  return date.toLocaleDateString("en-IN", {



    day: "2-digit",



    month: "short",



    year: "numeric",



  });



}



function getApplicationStatusLabel(status) {



  switch (status) {



    case "PENDING":



      return "Applied";



    case "REVIEWING":



      return "Under Review";



    case "SHORTLISTED":



      return "Shortlisted";



    case "ACCEPTED":



      return "Accepted";



    case "REJECTED":



      return "Rejected";



    default:



      return "Updated";



  }



}



function getApiErrorMessage(error, fallback) {



  return error?.response?.data?.message || fallback;



}



function StatCard({ icon: Icon, number, label, to }) {



  const content = (



    <>



      <div className="flex items-center justify-between">



        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">



          <Icon size={19} />



        </div>



        <ArrowUpRight



          size={17}



          className="text-slate-300 transition group-hover:text-[#0066b3]"



        />



      </div>



      <p className="mt-5 text-2xl font-black text-[#172b4d]">{number}</p>



      <p className="mt-1 text-sm text-slate-500">{label}</p>



    </>



  );



  return to ? (



    <Link



      to={to}



      className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-sm"



    >



      {content}



    </Link>



  ) : (



    <div className="rounded-2xl border border-slate-200 bg-white p-5">



      {content}



    </div>



  );



}



function LoadingCard() {



  return (



    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">



      <div className="h-10 w-10 rounded-xl bg-slate-200" />



      <div className="mt-5 h-7 w-14 rounded bg-slate-200" />



      <div className="mt-2 h-4 w-24 rounded bg-slate-200" />



    </div>



  );



}



export default function SeekerDashboard() {



  const { user } = useAuth();



  const [recommendedJobs, setRecommendedJobs] = useState([]);



  const [applications, setApplications] = useState([]);



  const [savedJobs, setSavedJobs] = useState([]);



  const [interviews, setInterviews] = useState([]);



  const [jobsLoading, setJobsLoading] = useState(true);



  const [applicationsLoading, setApplicationsLoading] = useState(true);



  const [error, setError] = useState("");



  useEffect(() => {



    let mounted = true;



    const loadJobs = async () => {



      try {



        setJobsLoading(true);



        const response = await getJobs({ page: 1, limit: 3 });



        const jobsFromResponse = Array.isArray(response?.data)



          ? response.data



          : Array.isArray(response?.data?.jobs)



            ? response.data.jobs



            : Array.isArray(response?.jobs)



              ? response.jobs



              : [];



        if (mounted) setRecommendedJobs(jobsFromResponse.slice(0, 3));



      } catch (requestError) {



        if (mounted) {



          setRecommendedJobs([]);



          setError(



            getApiErrorMessage(



              requestError,



              "Unable to load recommended jobs.",



            ),



          );



        }



      } finally {



        if (mounted) setJobsLoading(false);



      }



    };



    const loadApplications = async () => {



      try {



        setApplicationsLoading(true);



        const response = await getMyApplications();



        const applicationsFromResponse = Array.isArray(response?.data)



          ? response.data



          : Array.isArray(response?.data?.applications)



            ? response.data.applications



            : Array.isArray(response?.applications)



              ? response.applications



              : [];



        if (mounted) setApplications(applicationsFromResponse);



      } catch (requestError) {



        if (mounted) {



          setApplications([]);



          if (!requestError?.response) {



            toast.error("Unable to load your applications.");



          }



        }



      } finally {



        if (mounted) setApplicationsLoading(false);



      }



    };



    const loadLocalSeekerData = () => {

      try {

        if (!mounted) return;



        setSavedJobs(getSavedJobs());

      } catch (storageError) {

        console.error(

          "Unable to load saved jobs:",

          storageError,

        );

      }

    };



    const loadInterviews = async () => {

      try {

        const response = await getMyInterviews({

          page: 1,

          limit: 50,

        });



        const interviewsFromResponse = Array.isArray(

          response?.data,

        )

          ? response.data

          : Array.isArray(response?.data?.interviews)

            ? response.data.interviews

            : Array.isArray(response?.interviews)

              ? response.interviews

              : [];



        if (mounted) {

          setInterviews(interviewsFromResponse);

        }

      } catch (requestError) {

        console.error(

          "Unable to load interviews:",

          requestError,

        );



        if (mounted) {

          setInterviews([]);



          if (!requestError?.response) {

            toast.error("Unable to load your interviews.");

          }

        }

      }

    };



    loadJobs();

    loadApplications();

    loadLocalSeekerData();

    loadInterviews();



    return () => {



      mounted = false;



    };



  }, []);



  const stats = useMemo(() => {



    const shortlisted = applications.filter(



      (application) => application?.status === "SHORTLISTED",



    ).length;



    const upcomingInterviews = interviews.filter(



      (interview) =>



        interview?.status === "Upcoming" ||



        interview?.status === "Scheduled",



    ).length;



    return {



      applications: applications.length,



      shortlisted,



      interviews: upcomingInterviews,



      savedJobs: savedJobs.length,



    };



  }, [applications, interviews, savedJobs]);



  const profileCompletion = useMemo(() => {



    if (!user) return 0;



    const checks = [



      Boolean(user.name),



      Boolean(user.email),



      Boolean(user.phone),



      Boolean(user.headline),



      Boolean(user.location),



      Boolean(user.bio),



      Array.isArray(user.skills) && user.skills.length > 0,



      Boolean(user.resumeUrl),



      Boolean(user.linkedinUrl),



      Boolean(user.portfolioUrl),



      Array.isArray(user.education) && user.education.length > 0,



      Array.isArray(user.experience) && user.experience.length > 0,



    ];



    return Math.round(



      (checks.filter(Boolean).length / checks.length) * 100,



    );



  }, [user]);



  const recentApplications = useMemo(



    () =>



      [...applications]



        .sort(



          (first, second) =>



            new Date(second?.createdAt || 0).getTime() -



            new Date(first?.createdAt || 0).getTime(),



        )



        .slice(0, 3),



    [applications],



  );



  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "there";



  return (



      <div className="mx-auto max-w-7xl">



        <div className="rounded-2xl bg-[#10243e] p-6 text-white sm:p-8">



          <p className="text-sm text-blue-200">



            Good morning, {firstName} 👋



          </p>



          <h2 className="mt-2 text-2xl font-black sm:text-3xl">



            Keep your career moving forward.



          </h2>



          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">



            Discover relevant opportunities, track your applications, and keep



            your profile ready for recruiters.



          </p>



          <div className="mt-5 flex flex-wrap gap-3">



            <Link



              to="/jobs"



              className="inline-flex items-center gap-2 rounded-xl bg-[#0066b3] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#005493]"



            >



              Explore Jobs



              <ArrowUpRight size={16} />



            </Link>



            <Link



              to="/dashboard/profile"



              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"



            >



              Complete Profile



            </Link>



          </div>



        </div>



        {error && (



          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">



            {error}



          </div>



        )}



        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">



          {applicationsLoading ? (



            <>



              <LoadingCard />



              <LoadingCard />



              <LoadingCard />



              <LoadingCard />



            </>



          ) : (



            <>



              <StatCard number={stats.applications} label="Applications" icon={FileText} to="/dashboard/applied-jobs" />



              <StatCard number={stats.shortlisted} label="Shortlisted" icon={CheckCircle2} to="/dashboard/applied-jobs" />



              <StatCard number={stats.interviews} label="Upcoming Interviews" icon={CalendarDays} to="/dashboard/interviews" />



              <StatCard number={stats.savedJobs} label="Saved Jobs" icon={Bookmark} to="/dashboard/saved-jobs" />



            </>



          )}



        </div>



        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">



          <section className="rounded-2xl border border-slate-200 bg-white p-6">



            <div className="flex items-center justify-between gap-4">



              <div>



                <h3 className="font-extrabold text-[#172b4d]">Recommended Jobs</h3>



                <p className="mt-1 text-xs text-slate-500">



                  Latest open opportunities from the job portal



                </p>



              </div>



              <Link



                to="/jobs"



                className="shrink-0 text-xs font-bold text-[#0066b3] hover:underline"



              >



                View all



              </Link>



            </div>



            <div className="mt-5 space-y-3">



              {jobsLoading ? (



                <>



                  <div className="h-20 animate-pulse rounded-xl bg-slate-100" />



                  <div className="h-20 animate-pulse rounded-xl bg-slate-100" />



                  <div className="h-20 animate-pulse rounded-xl bg-slate-100" />



                </>



              ) : recommendedJobs.length > 0 ? (



                recommendedJobs.map((job) => {



                  const jobId = job?._id || job?.id;



                  const companyName =



                    job?.companyName || job?.company?.name || "Company";



                  return (



                    <Link



                      key={jobId}



                      to={`/jobs/${jobId}`}



                      className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-blue-100 hover:bg-blue-50/30"



                    >



                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">



                        <BriefcaseBusiness size={18} />



                      </div>



                      <div className="min-w-0 flex-1">



                        <p className="truncate text-sm font-extrabold text-[#172b4d]">



                          {job?.title || "Untitled Job"}



                        </p>



                        <p className="mt-1 truncate text-xs text-slate-500">



                          {companyName}



                        </p>



                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400">



                          <span className="flex items-center gap-1">



                            <MapPin size={12} />



                            {job?.location || "Location not specified"}



                          </span>



                          <span className="flex items-center gap-1">



                            <BriefcaseBusiness size={12} />



                            {formatEnum(job?.employmentType) || "Not specified"}



                          </span>



                        </div>



                      </div>



                      <div className="hidden shrink-0 text-right sm:block">



                        <p className="text-xs font-bold text-[#0066b3]">



                          {formatSalary(job?.salaryMin, job?.salaryMax)}



                        </p>



                        <p className="mt-1 text-[11px] text-slate-400">



                          {formatRelativeDate(job?.createdAt)}



                        </p>



                      </div>



                    </Link>



                  );



                })



              ) : (



                <div className="rounded-xl border border-dashed border-slate-200 px-5 py-10 text-center">



                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">



                    <BriefcaseBusiness size={21} />



                  </div>



                  <p className="mt-3 text-sm font-bold text-slate-700">



                    No jobs available yet



                  </p>



                  <p className="mt-1 text-xs text-slate-500">



                    Check the jobs page for new opportunities.



                  </p>



                  <Link



                    to="/jobs"



                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0066b3] px-4 py-2.5 text-xs font-bold text-white"



                  >



                    Find Jobs



                    <Search size={14} />



                  </Link>



                </div>



              )}



            </div>



          </section>



          <section className="rounded-2xl border border-slate-200 bg-white p-6">



            <div className="flex items-center justify-between gap-3">



              <div>



                <h3 className="font-extrabold text-[#172b4d]">Application Activity</h3>



                <p className="mt-1 text-xs text-slate-500">



                  Your latest application updates



                </p>



              </div>



              <Link



                to="/dashboard/applied-jobs"



                className="text-xs font-bold text-[#0066b3] hover:underline"



              >



                View all



              </Link>



            </div>



            <div className="mt-6 space-y-5">



              {applicationsLoading ? (



                <>



                  <div className="h-12 animate-pulse rounded-lg bg-slate-100" />



                  <div className="h-12 animate-pulse rounded-lg bg-slate-100" />



                  <div className="h-12 animate-pulse rounded-lg bg-slate-100" />



                </>



              ) : recentApplications.length > 0 ? (



                recentApplications.map((application) => {



                  const job = application?.job || {};



                  const applicationId = application?._id || application?.id;



                  return (



                    <Link



                      key={applicationId}



                      to={



                        applicationId



                          ?  `/dashboard/applications/${applicationId}`



                          : "/applied-jobs"



                      }



                      className="group flex gap-3"



                    >



                      <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0066b3]" />



                      <div className="min-w-0">



                        <p className="truncate text-sm font-bold text-[#172b4d] group-hover:text-[#0066b3]">



                          {job?.title || application?.title || "Job Application"}



                        </p>



                        <p className="mt-1 text-xs text-slate-500">



                          {getApplicationStatusLabel(application?.status)}



                          {application?.createdAt



                            ? ` · ${formatRelativeDate(application.createdAt)}`



                            : ""}



                        </p>



                      </div>



                    </Link>



                  );



                })



              ) : (



                <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">



                  <FileText size={22} className="mx-auto text-slate-300" />



                  <p className="mt-3 text-sm font-bold text-slate-700">



                    No applications yet



                  </p>



                  <p className="mt-1 text-xs text-slate-500">



                    Apply to a job and your activity will appear here.



                  </p>



                  <Link



                    to="/jobs"



                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0066b3] px-4 py-2.5 text-xs font-bold text-white"



                  >



                    Explore Jobs



                    <ArrowUpRight size={14} />



                  </Link>



                </div>



              )}



            </div>



            <div className="mt-8 rounded-xl bg-slate-50 p-4">



              <div className="flex items-center justify-between gap-3">



                <div className="flex items-center gap-2 text-sm font-bold text-[#172b4d]">



                  <Clock3 size={16} className="text-[#0066b3]" />



                  Profile completion



                </div>



                <span className="text-xs font-bold text-[#0066b3]">



                  {profileCompletion}%



                </span>



              </div>



              <div className="mt-3 h-2 rounded-full bg-slate-200">



                <div



                  className="h-2 rounded-full bg-[#0066b3] transition-all duration-500"



                  style={{ width: `${profileCompletion}%` }}



                />



              </div>



              <p className="mt-2 text-xs text-slate-500">



                {profileCompletion >= 100



                  ? "Your profile is complete."



                  : "Complete your profile to improve your visibility to recruiters."}



              </p>



              {profileCompletion < 100 && (



                <Link



                  to="/dashboard/profile"



                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0066b3] hover:underline"



                >



                  Complete profile



                  <ArrowUpRight size={13} />



                </Link>



              )}



            </div>



          </section>



        </div>



        <section className="mt-6 grid gap-4 sm:grid-cols-3">



          <Link



            to="/jobs"



            className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-sm"



          >



            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">



              <Search size={19} />



            </div>



            <h3 className="mt-4 font-extrabold text-[#172b4d]">Find Jobs</h3>



            <p className="mt-1 text-xs leading-5 text-slate-500">



              Search current openings and discover your next opportunity.



            </p>



            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0066b3]">



              Browse jobs



              <ArrowUpRight



                size={13}



                className="transition group-hover:translate-x-0.5"



              />



            </span>



          </Link>



          <Link



            to="/dashboard/profile"



            className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-sm"



          >



            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">



              <BriefcaseBusiness size={19} />



            </div>



            <h3 className="mt-4 font-extrabold text-[#172b4d]">Improve Profile</h3>



            <p className="mt-1 text-xs leading-5 text-slate-500">



              Keep your skills, experience, resume and links up to date.



            </p>



            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0066b3]">



              Edit profile



              <ArrowUpRight



                size={13}



                className="transition group-hover:translate-x-0.5"



              />



            </span>



          </Link>



          <Link



            to="/dashboard/applied-jobs"



            className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-sm"



          >



            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">



              <FileText size={19} />



            </div>



            <h3 className="mt-4 font-extrabold text-[#172b4d]">



              Track Applications



            </h3>



            <p className="mt-1 text-xs leading-5 text-slate-500">



              Check your application status and follow recruiter updates.



            </p>



            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0066b3]">



              View applications



              <ArrowUpRight



                size={13}



                className="transition group-hover:translate-x-0.5"



              />



            </span>



          </Link>



        </section>



      </div>



  );



}
