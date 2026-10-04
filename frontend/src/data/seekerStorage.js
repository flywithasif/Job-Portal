// Shared localStorage keys for the job seeker area.
const STORAGE_KEYS = {
  applications: "job_portal_applications",
  savedJobs: "job_portal_saved_jobs",
  interviews: "job_portal_interviews",
};

// Initial demo applications.
// These are used only when no saved data exists yet.
const initialApplications = [
  {
    id: 1,
    jobId: 1,
    title: "Senior Frontend Developer",
    company: "TechNova Solutions",
    location: "Gurugram, Haryana",
    appliedDate: "28 Sep 2026",
    status: "Interview",
    type: "Full-time",
    salary: "₹10L - ₹16L",
    nextStep: "Interview scheduled",
  },
  {
    id: 2,
    jobId: 2,
    title: "React Developer",
    company: "DigitalCraft Labs",
    location: "Remote",
    appliedDate: "25 Sep 2026",
    status: "Under Review",
    type: "Full-time",
    salary: "₹8L - ₹14L",
    nextStep: "Recruiter is reviewing your profile",
  },
  {
    id: 3,
    jobId: 3,
    title: "MERN Stack Developer",
    company: "CloudPeak Technologies",
    location: "Noida, Uttar Pradesh",
    appliedDate: "21 Sep 2026",
    status: "Shortlisted",
    type: "Full-time",
    salary: "₹7L - ₹12L",
    nextStep: "Recruiter shortlisted your application",
  },
  {
    id: 4,
    jobId: 4,
    title: "Backend Developer",
    company: "CodeSphere Technologies",
    location: "Bengaluru, Karnataka",
    appliedDate: "18 Sep 2026",
    status: "Rejected",
    type: "Full-time",
    salary: "₹8L - ₹13L",
    nextStep: "Application was not selected",
  },
  {
    id: 5,
    jobId: 5,
    title: "Software Engineer",
    company: "InnovateX",
    location: "Pune, Maharashtra",
    appliedDate: "15 Sep 2026",
    status: "Applied",
    type: "Full-time",
    salary: "₹6L - ₹10L",
    nextStep: "Application submitted successfully",
  },
];

// Initial demo saved jobs.
const initialSavedJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechNova Solutions",
    location: "Gurugram, Haryana",
    type: "Full-time",
    salary: "₹10L - ₹16L",
    posted: "2 days ago",
    logo: "TN",
  },
  {
    id: 2,
    title: "React Developer",
    company: "DigitalCraft Labs",
    location: "Remote",
    type: "Full-time",
    salary: "₹8L - ₹14L",
    posted: "4 days ago",
    logo: "DC",
  },
  {
    id: 3,
    title: "MERN Stack Developer",
    company: "CloudPeak Technologies",
    location: "Noida, Uttar Pradesh",
    type: "Full-time",
    salary: "₹7L - ₹12L",
    posted: "1 week ago",
    logo: "CP",
  },
];

// Initial demo interviews.
const initialInterviews = [
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

// Read stored data safely and seed demo data on first use.
function readData(key, initialData) {
  try {
    const storedValue = localStorage.getItem(key);

    if (storedValue !== null) {
      const parsedValue = JSON.parse(storedValue);

      if (Array.isArray(parsedValue)) {
        return parsedValue;
      }
    }

    localStorage.setItem(key, JSON.stringify(initialData));

    return initialData;
  } catch (error) {
    console.error("Could not read job portal data:", error);

    return initialData;
  }
}

// Save data and notify components in the same browser tab.
function writeData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));

    window.dispatchEvent(
      new CustomEvent("job-portal-storage", {
        detail: { key },
      }),
    );

    return true;
  } catch (error) {
    console.error("Could not save job portal data:", error);

    return false;
  }
}

// Applications.
export function getApplications() {
  return readData(STORAGE_KEYS.applications, initialApplications);
}

export function saveApplications(applications) {
  return writeData(STORAGE_KEYS.applications, applications);
}

// Saved jobs.
export function getSavedJobs() {
  return readData(STORAGE_KEYS.savedJobs, initialSavedJobs);
}

export function saveSavedJobs(savedJobs) {
  return writeData(STORAGE_KEYS.savedJobs, savedJobs);
}

// Interviews.
export function getInterviews() {
  return readData(STORAGE_KEYS.interviews, initialInterviews);
}

export function saveInterviews(interviews) {
  return writeData(STORAGE_KEYS.interviews, interviews);
}

// Listen for changes from other components or browser tabs.
export function subscribeToSeekerData(callback) {
  const handleCustomStorage = () => callback();
  const handleBrowserStorage = (event) => {
    if (
      !event.key ||
      Object.values(STORAGE_KEYS).includes(event.key)
    ) {
      callback();
    }
  };

  window.addEventListener("job-portal-storage", handleCustomStorage);
  window.addEventListener("storage", handleBrowserStorage);

  return () => {
    window.removeEventListener("job-portal-storage", handleCustomStorage);
    window.removeEventListener("storage", handleBrowserStorage);
  };
}
