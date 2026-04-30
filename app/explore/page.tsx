import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../supabase/server";
import ExploreClient from "./explore-client";

const categories = ["All", "Programming", "Design", "Music", "Languages", "Academics", "Soft Skills", "Business", "Arts"];

export default async function ExplorePage() {
  const supabase = await createClient();

  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .order('name');

  const skillsList = skills || [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F1F35" }}>
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#EDF2F7] mb-4" style={{ fontFamily: "Fraunces, serif" }}>
            Explore Skills
          </h1>
          <p className="text-[#A0AEC0] text-lg max-w-2xl mx-auto">
            Browse 150+ skills available for barter. Find someone who has what you want, offer what you know.
          </p>
        </div>
        <ExploreClient skills={skillsList} categories={categories} />
        {/* CTA */}
        <div className="text-center mt-16">
          <div className="glass-card rounded-2xl p-8 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-[#EDF2F7] mb-3" style={{ fontFamily: "Fraunces, serif" }}>
              Don't see your skill?
            </h2>
            <p className="text-[#A0AEC0] text-sm mb-6">
              Sign up and add any skill you want to teach. New skills are added every week!
            </p>
            <a
              href="/sign-up"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-medium rounded-xl transition-colors"
            >
              Add Your Skills
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
