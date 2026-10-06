import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  Lightbulb,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  "All",
  "Resume",
  "Interviews",
  "Job Search",
  "Career Growth",
];

const articles = [
  {
    id: 1,
    category: "Resume",
    icon: FileText,
    readTime: "5 min read",
    featured: true,
    title: "How to build a resume that gets noticed",
    description:
      "Learn how to structure your resume, highlight relevant skills, and make your experience easier for recruiters to understand.",
    content: [
      "A strong resume should make it easy for a recruiter to understand who you are, what you can do, and why you are relevant for the role.",
      "Start with a clear professional summary. Keep it short and focus on your strongest skills, experience, and the type of opportunity you are looking for.",
      "When writing your experience section, focus on outcomes instead of simply listing responsibilities. Whenever possible, explain what you improved, built, managed, or achieved.",
      "Your skills section should be relevant to the jobs you are applying for. Prioritize skills that appear repeatedly in the job descriptions you are targeting.",
      "Finally, keep the design clean and easy to scan. Avoid unnecessary graphics, excessive colors, and long paragraphs that make important information difficult to find.",
    ],
    tips: [
      "Keep your resume concise and focused.",
      "Tailor your resume for the role you want.",
      "Use measurable achievements whenever possible.",
      "Keep your most relevant skills easy to find.",
    ],
  },
  {
    id: 2,
    category: "Interviews",
    icon: Users,
    readTime: "7 min read",
    title: "How to prepare for your next interview",
    description:
      "A practical guide to researching the company, preparing answers, handling common questions, and presenting yourself confidently.",
    content: [
      "Interview preparation starts before the interview itself. Learn about the company, understand the role, and review the skills mentioned in the job description.",
      "Prepare examples from your experience that demonstrate problem-solving, teamwork, communication, ownership, and technical ability.",
      "Practice common questions without memorizing answers word for word. Your goal should be to communicate naturally and confidently.",
      "During the interview, listen carefully before answering. If you need clarification, ask a thoughtful question instead of rushing into an answer.",
      "At the end, ask meaningful questions about the role, team, expectations, and company. This shows that you are evaluating the opportunity seriously.",
    ],
    tips: [
      "Research the company before the interview.",
      "Prepare real examples from your experience.",
      "Practice speaking clearly and concisely.",
      "Prepare 2–3 questions for the interviewer.",
    ],
  },
  {
    id: 3,
    category: "Job Search",
    icon: Search,
    readTime: "6 min read",
    title: "A smarter way to search for jobs",
    description:
      "Use targeted searches, relevant keywords, company research, and consistent applications to make your job search more effective.",
    content: [
      "A good job search is not just about applying to as many jobs as possible. It is about finding opportunities where your skills and experience are genuinely relevant.",
      "Start by defining the type of role you want, the skills you can offer, and the locations or work arrangements that fit your goals.",
      "Use specific keywords when searching. Instead of searching for a broad term, combine your target role with important skills, technologies, or locations.",
      "Research companies before applying. Understanding what a company does can help you decide whether the opportunity is actually right for you.",
      "Track your applications so you know which companies you contacted, when you applied, and what stage each application is currently in.",
    ],
    tips: [
      "Define your target role before searching.",
      "Use specific job-search keywords.",
      "Research companies before applying.",
      "Keep track of your applications.",
    ],
  },
  {
    id: 4,
    category: "Career Growth",
    icon: Target,
    readTime: "8 min read",
    title: "How to plan your next career move",
    description:
      "Understand where you are today, identify your strengths, and create a practical plan for reaching your next professional milestone.",
    content: [
      "Career growth becomes easier when you know where you are going. Start by reviewing your current skills, experience, responsibilities, and achievements.",
      "Identify the gap between your current position and the role you want next. This could be a missing technical skill, leadership experience, certification, or industry exposure.",
      "Turn those gaps into specific goals. Instead of saying you want to become better at something, define exactly what you will learn or accomplish and by when.",
      "Look for opportunities within your current role as well. New responsibilities, projects, mentorship, and cross-functional work can help you build experience before your next move.",
      "Review your progress regularly and adjust your plan as your goals change.",
    ],
    tips: [
      "Identify your current strengths and gaps.",
      "Choose specific skills to develop.",
      "Set measurable career goals.",
      "Review your progress regularly.",
    ],
  },
  {
    id: 5,
    category: "Resume",
    icon: Sparkles,
    readTime: "5 min read",
    title: "Skills that can make your profile stronger",
    description:
      "Discover how to present technical and professional skills in a way that clearly communicates your value to employers.",
    content: [
      "A strong profile does more than list skills. It shows how those skills have been applied in real projects, jobs, internships, or other meaningful experiences.",
      "Separate your core technical skills from supporting professional skills so recruiters can quickly understand your strengths.",
      "Avoid adding every technology or tool you have ever touched. Prioritize skills you can confidently discuss and demonstrate.",
      "Projects can be especially useful for candidates with limited professional experience because they provide evidence of practical ability.",
      "Keep your skills aligned with the type of role you want next.",
    ],
    tips: [
      "Prioritize skills you can confidently demonstrate.",
      "Use projects to show practical ability.",
      "Keep your skill list relevant.",
      "Separate technical and professional strengths.",
    ],
  },
  {
    id: 6,
    category: "Career Growth",
    icon: BriefcaseBusiness,
    readTime: "6 min read",
    title: "How to grow after landing your first job",
    description:
      "Your first job is only the beginning. Learn how to build experience, improve your skills, and position yourself for future opportunities.",
    content: [
      "Your first job is an opportunity to build a strong professional foundation. Focus on learning how the organization works and becoming dependable in your role.",
      "Ask for feedback and use it constructively. Understanding what you are doing well and where you can improve will help you grow faster.",
      "Take ownership of meaningful work whenever possible. Projects that create measurable value can become important achievements in your future career.",
      "Continue developing your skills outside your immediate responsibilities. The best professionals keep learning even after they become comfortable in their current roles.",
      "Keep a record of important projects and achievements. This will make future performance reviews and job applications much easier.",
    ],
    tips: [
      "Ask for regular feedback.",
      "Take ownership of meaningful projects.",
      "Keep learning beyond your current role.",
      "Document your achievements.",
    ],
  },
  {
    id: 7,
    category: "Interviews",
    icon: CheckCircle2,
    readTime: "6 min read",
    title: "How to answer behavioral interview questions",
    description:
      "Learn how to turn your real experiences into clear, structured answers that demonstrate your professional strengths.",
    content: [
      "Behavioral questions are designed to understand how you handled real situations in the past. The strongest answers usually come from genuine experiences.",
      "A simple structure is to explain the situation, your responsibility, the action you took, and the result.",
      "Choose examples that demonstrate skills relevant to the position. Problem-solving, ownership, communication, adaptability, and teamwork are commonly valuable.",
      "Keep your answers focused. Give enough context for the interviewer to understand the situation without spending most of your answer on background information.",
      "Finish with the result and, when appropriate, explain what you learned from the experience.",
    ],
    tips: [
      "Use real examples.",
      "Structure your answer clearly.",
      "Focus on your individual contribution.",
      "Always explain the outcome.",
    ],
  },
  {
    id: 8,
    category: "Job Search",
    icon: TrendingUp,
    readTime: "5 min read",
    title: "How to improve your chances of getting noticed",
    description:
      "Small improvements to your profile, applications, and communication can make your job search more effective.",
    content: [
      "Recruiters often review many candidates for the same position, so clarity matters. Make sure your profile quickly communicates your target role and strongest capabilities.",
      "Use a professional profile headline that describes what you do instead of using a generic title.",
      "Keep your application information consistent across your resume, profile, and other professional materials.",
      "When possible, customize your application for the specific role. Highlight the experience and skills most relevant to that position.",
      "Professional communication matters too. Keep messages short, respectful, specific, and focused on the opportunity.",
    ],
    tips: [
      "Make your target role clear.",
      "Keep your professional profiles consistent.",
      "Customize important applications.",
      "Communicate professionally.",
    ],
  },
];

function ArticleIcon({ icon: Icon }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
      <Icon size={22} />
    </div>
  );
}

export default function CareerAdvice() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === "All" || article.category === activeCategory;

      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const relatedArticles = useMemo(() => {
    if (!selectedArticle) {
      return [];
    }

    return articles
      .filter(
        (article) =>
          article.id !== selectedArticle.id &&
          article.category === selectedArticle.category,
      )
      .slice(0, 3);
  }, [selectedArticle]);

  if (selectedArticle) {
    const Icon = selectedArticle.icon;

    return (
      <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
        <section className="relative overflow-hidden bg-[#07111f]">
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-12 lg:px-8 lg:pb-20">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="mb-10 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/10"
            >
              <ArrowLeft size={17} />
              Back to career advice
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-blue-300">
                {selectedArticle.category}
              </span>

              <span className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <Clock3 size={15} />
                {selectedArticle.readTime}
              </span>
            </div>

            <h1 className="mt-7 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {selectedArticle.title}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              {selectedArticle.description}
            </p>
          </div>
        </section>

        <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
              <div className="mb-9 flex items-center gap-4 border-b border-slate-100 pb-8">
                <ArticleIcon icon={Icon} />

                <div>
                  <p className="text-sm font-black text-slate-900">
                    CareerFlow Career Guide
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Practical advice for your next career move
                  </p>
                </div>
              </div>

              <div className="space-y-7">
                {selectedArticle.content.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base leading-8 text-slate-600"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <Lightbulb size={19} />
                  </div>

                  <h2 className="text-lg font-black text-slate-900">
                    Key takeaways
                  </h2>
                </div>

                <ul className="mt-5 space-y-3">
                  {selectedArticle.tips.map((tip) => (
                    <li
                      key={tip}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                    >
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-blue-600"
                      />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Keep exploring
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-900">
                Related advice
              </h2>

              <div className="mt-6 space-y-4">
                {relatedArticles.length > 0 ? (
                  relatedArticles.map((article) => (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => setSelectedArticle(article)}
                      className="group w-full rounded-2xl border border-slate-100 p-4 text-left transition hover:border-blue-100 hover:bg-blue-50/50"
                    >
                      <p className="text-xs font-bold text-blue-600">
                        {article.category}
                      </p>

                      <p className="mt-2 text-sm font-black leading-6 text-slate-900">
                        {article.title}
                      </p>

                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-slate-400 transition group-hover:text-blue-600">
                        Read
                        <ArrowRight size={13} />
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-slate-500">
                    Explore more career resources to keep building your skills.
                  </p>
                )}
              </div>

              <Link
                to="/jobs"
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-600"
              >
                Explore jobs
                <ArrowRight size={16} />
              </Link>
            </aside>
          </div>
        </main>
      </div>
    );
  }

  const featuredArticle = articles.find((article) => article.featured);

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#07111f]">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-300 backdrop-blur">
                <Sparkles size={14} />
                CareerFlow Guides
              </div>

              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Build a career you're{" "}
                <span className="text-blue-400">proud of.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Practical advice to help you find better opportunities,
                prepare with confidence, and keep growing professionally.
              </p>

              <div className="mt-9 max-w-2xl">
                <div className="flex rounded-2xl border border-white/10 bg-white p-2 shadow-2xl">
                  <div className="relative flex-1">
                    <Search
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search career advice..."
                      className="h-12 w-full bg-transparent pl-12 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("career-resources")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="hidden rounded-xl bg-blue-600 px-6 text-sm font-black text-white transition hover:bg-blue-700 sm:block"
                  >
                    Explore
                  </button>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-8">
                <div>
                  <p className="text-2xl font-black text-white">
                    {articles.length}+
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Career guides
                  </p>
                </div>

                <div className="h-10 w-px bg-white/10" />

                <div>
                  <p className="text-2xl font-black text-white">5</p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Career topics
                  </p>
                </div>

                <div className="h-10 w-px bg-white/10" />

                <div>
                  <p className="text-2xl font-black text-white">100%</p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Practical
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative mx-auto max-w-md">
                <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/10 blur-2xl" />

                <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Featured guide
                      </p>
                      <p className="mt-1 text-lg font-black text-white">
                        Start here
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                      <Lightbulb size={20} />
                    </div>
                  </div>

                  <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <ArticleIcon icon={featuredArticle.icon} />

                    <p className="mt-5 text-xs font-bold uppercase tracking-wider text-blue-300">
                      {featuredArticle.category}
                    </p>

                    <h2 className="mt-2 text-xl font-black leading-8 text-white">
                      {featuredArticle.title}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {featuredArticle.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedArticle(featuredArticle)}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-black text-blue-300"
                    >
                      Read guide
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl overflow-x-auto px-6 lg:px-8">
          <div className="flex min-w-max items-center gap-2 py-5">
            {categories.map((category) => {
              const active = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-5 py-2.5 text-sm font-black transition ${
                    active
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resources */}
      <main
        id="career-resources"
        className="mx-auto max-w-7xl px-6 py-14 lg:px-8"
      >
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Career resources
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Advice for every stage
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Practical guides designed to help you make smarter career
              decisions.
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">
            {filteredArticles.length}{" "}
            {filteredArticles.length === 1 ? "article" : "articles"}
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Search size={28} />
            </div>

            <h3 className="mt-6 text-xl font-black text-slate-900">
              No advice found
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Try another search term or choose a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => {
              const Icon = article.icon;

              return (
                <article
                  key={article.id}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-slate-200/60"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 opacity-0 transition group-hover:opacity-100" />

                  <div className="flex items-start justify-between gap-4">
                    <ArticleIcon icon={Icon} />

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-500">
                      {article.category}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-black leading-8 tracking-tight text-slate-900">
                    {article.title}
                  </h3>

                  <p className="mt-4 flex-1 text-sm leading-7 text-slate-500">
                    {article.description}
                  </p>

                  <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Clock3 size={14} />
                      {article.readTime}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedArticle(article)}
                      className="flex items-center gap-2 text-sm font-black text-blue-600 transition hover:text-blue-700"
                    >
                      Read article
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#07111f] px-7 py-12 shadow-2xl sm:px-12 lg:px-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">
                Your next move
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Ready for your next opportunity?
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                Put what you have learned into action and discover your next
                career opportunity.
              </p>
            </div>

            <Link
              to="/jobs"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white transition hover:bg-blue-500"
            >
              Explore jobs
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}