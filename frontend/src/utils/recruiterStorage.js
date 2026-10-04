const RECRUITER_STORAGE_KEYS = {
  companyProfile: "job_portal_recruiter_company_profile",
  jobs: "job_portal_recruiter_jobs",
  applicants: "job_portal_recruiter_applicants",
};

/**
 * Read recruiter data from localStorage.
 * Returns the fallback value if data is missing or invalid.
 */
export function readRecruiterData(key, fallback = []) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const storedValue = window.localStorage.getItem(key);

    if (storedValue === null) {
      return fallback;
    }

    const parsedValue = JSON.parse(storedValue);

    return parsedValue ?? fallback;
  } catch (error) {
    console.error(`Failed to read recruiter data (${key}):`, error);
    return fallback;
  }
}

/**
 * Save recruiter data to localStorage.
 * Returns true when saved and false when saving fails.
 */
export function writeRecruiterData(key, value) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to save recruiter data (${key}):`, error);
    return false;
  }
}

export { RECRUITER_STORAGE_KEYS };