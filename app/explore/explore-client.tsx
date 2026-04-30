"use client";

import { useState } from "react";
import { Search, Users, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

const fallbackSkills = [
  { id: "1", name: "Python", category: "Programming", learner_count: 234, description: "The most popular programming language for data science, automation, and web development." },
  { id: "2", name: "Guitar", category: "Music", learner_count: 189, description: "Learn chords, scales, and songs from beginner to advanced." },
  { id: "3", name: "Web Design", category: "Design", learner_count: 156, description: "HTML, CSS, responsive design, and modern UI principles." },
  { id: "4", name: "Data Science", category: "Programming", learner_count: 143, description: "Data analysis, visualization, and statistical modeling." },
  { id: "5", name: "Hindi", category: "Languages", learner_count: 128, description: "Conversational Hindi for everyday life and business." },
  { id: "6", name: "Mathematics", category: "Academics", learner_count: 119, description: "Calculus, linear algebra, statistics, and more." },
  { id: "7", name: "JavaScript", category: "Programming", learner_count: 211, description: "Modern JS, ES6+, async programming, and DOM manipulation." },
  { id: "8", name: "React", category: "Programming", learner_count: 198, description: "Build interactive UIs with React, hooks, and state management." },
  { id: "9", name: "Machine Learning", category: "Programming", learner_count: 167, description: "ML algorithms, model training, and AI applications." },
  { id: "10", name: "UI/UX Design", category: "Design", learner_count: 145, description: "User research, wireframing, prototyping, and Figma." },
  { id: "11", name: "Piano", category: "Music", learner_count: 134, description: "Classical and contemporary piano from beginner to advanced." },
  { id: "12", name: "Photography", category: "Arts", learner_count: 122, description: "Composition, lighting, editing, and storytelling through photos." },
  { id: "13", name: "Public Speaking", category: "Soft Skills", learner_count: 111, description: "Confidence, delivery, storytelling, and presentation skills." },
  { id: "14", name: "Finance", category: "Business", learner_count: 98, description: "Personal finance, investing, and financial planning." },
  { id: "15", name: "Figma", category: "Design", learner_count: 134, description: "Professional UI design, components, and prototyping in Figma." },
  { id: "16", name: "English Speaking", category: "Languages", learner_count: 178, description: "Fluent English communication for academic and professional life." },
  { id: "17", name: "Kannada", category: "Languages", learner_count: 89, description: "Learn Kannada — script, vocabulary, and conversation." },
  { id: "18", name: "Java", category: "Programming", learner_count: 145, description: "Core Java, OOP, data structures, and Spring Boot basics." },
  { id: "19", name: "Video Editing", category: "Arts", learner_count: 112, description: "Premiere Pro, DaVinci Resolve, and storytelling through video." },
  { id: "20", name: "Marketing", category: "Business", learner_count: 103, description: "Digital marketing, SEO, social media, and growth strategies." },
  { id: "21", name: "Physics", category: "Academics", learner_count: 87, description: "Mechanics, electromagnetism, thermodynamics, and quantum physics." },
  { id: "22", name: "C++", category: "Programming", learner_count: 134, description: "Systems programming, competitive coding, and game development." },
];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Programming: { bg: "#2B6CB020", text: "#63B3ED", border: "#2B6CB030" },
  Music: { bg: "#D69E2E20", text: "#D69E2E", border: "#D69E2E30" },
  Design: { bg: "#9F7AEA20", text: "#B794F4", border: "#9F7AEA30" },
  Languages: { bg: "#38A16920", text: "#68D391", border: "#38A16930" },
  Academics: { bg: "#63B3ED20", text: "#90CDF4", border: "#63B3ED30" },
  "Soft Skills": { bg: "#FC8181/20", text: "#FEB2B2", border: "#FC818130" },
  Business: { bg: "#F6AD5520", text: "#FBD38D", border: "#F6AD5530" },
  Arts: { bg: "#F687B320", text: "#FBB6CE", border: "#F687B330" },
};

interface Skill {
  id: string;
  name: string;
  category?: string;
  learner_count?: number;
  description?: string;
}

export default function ExploreClient({ skills, categories }: { skills: Skill[]; categories: string[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const displaySkills = skills.length > 0 ? skills : fallbackSkills;

  const filtered = displaySkills.filter((skill) => {
    const matchesSearch =
      search === "" ||
      skill.name.toLowerCase().includes(search.toLowerCase()) ||
      (skill.category || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || skill.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills... e.g., Python, Guitar, Design"
            className="w-full pl-11 pr-4 py-3 rounded-xl text-[#EDF2F7] placeholder-[#A0AEC0] outline-none focus:border-[#2B6CB0]/60 transition-colors"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-[#2B6CB0] text-white"
                : "text-[#A0AEC0] hover:text-[#EDF2F7]"
            }`}
            style={
              activeCategory !== cat
                ? {
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }
                : undefined
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[#A0AEC0]">
          Showing <span className="text-[#EDF2F7] font-medium">{filtered.length}</span> skills
          {search && ` for "${search}"`}
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </p>
        <p className="text-xs text-[#A0AEC0]">
          💡 Can't find yours?{" "}
          <Link href="/sign-up" className="text-[#2B6CB0] hover:text-[#63B3ED]">
            Add it on signup
          </Link>
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((skill, i) => {
          const catStyle = categoryColors[skill.category || ""] || categoryColors.Programming;
          return (
            <Link
              key={skill.id}
              href="/sign-up"
              className="glass-card rounded-2xl p-5 hover:bg-white/10 transition-all duration-200 hover:scale-105 group animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${(i % 8) * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="px-2 py-0.5 text-xs rounded-full font-medium"
                  style={{
                    backgroundColor: catStyle.bg,
                    color: catStyle.text,
                    border: `1px solid ${catStyle.border}`,
                  }}
                >
                  {skill.category || "General"}
                </span>
                <Users className="w-3.5 h-3.5 text-[#A0AEC0]" />
              </div>
              <h3 className="text-base font-semibold text-[#EDF2F7] mb-1 group-hover:text-white transition-colors">
                {skill.name}
              </h3>
              {skill.description && (
                <p className="text-xs text-[#A0AEC0] leading-relaxed mb-3 line-clamp-2">
                  {skill.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A0AEC0]">
                  {skill.learner_count || Math.floor(Math.random() * 200 + 50)} learners
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2B6CB0] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-[#EDF2F7] mb-2">No skills found</h3>
          <p className="text-[#A0AEC0]">
            Try a different search term or{" "}
            <Link href="/sign-up" className="text-[#2B6CB0] hover:text-[#63B3ED]">
              add your skill
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
