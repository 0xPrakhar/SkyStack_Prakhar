import React from "react";
import { Target, Users, ShieldCheck, Globe, Zap, Award } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Target className="text-mint-600" size={32} />,
      title: "Our Mission",
      desc: "Humara maqsad logon ko behtareen events aur experiences se jodna hai, chahe wo tech conference ho ya music festival.",
    },
    {
      icon: <Users className="text-blue-600" size={32} />,
      title: "For Everyone",
      desc: "Hum attendees aur organizers dono ke liye ek smooth aur easy platform provide karte hain.",
    },
    {
      icon: <ShieldCheck className="text-purple-600" size={32} />,
      title: "Secure Booking",
      desc: "Aapki privacy aur transactions hamari priority hain. Secure QR-based ticketing system ke saath.",
    },
  ];

  const stats = [
    { label: "Events Hosted", value: "500+" },
    { label: "Happy Users", value: "10k+" },
    { label: "Cities Covered", value: "25+" },
    { label: "Organizers", value: "100+" },
  ];

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <div className="relative py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Empowering <span className="text-mint-500">Connections</span>{" "}
            through Events
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Event Hub ek modern platform hai jahan passion ko experiences milte
            hain. Humne events ko discover aur manage karne ke tarike ko badal
            diya hai.
          </p>
        </div>
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-mint-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* 2. Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {f.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Company Introduction Detailed Section */}
      <div className="bg-gray-900 py-20 text-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              A Platform Built by <br />
              <span className="text-mint-400">Organizers for Organizers</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Hum jaante hain ki ek event host karna kitna mushkil ho sakta hai.
              Isliye humne aise tools banaye hain jo ticketing, analytics aur
              promotion ko asaan banate hain.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="flex items-start gap-3">
                <Zap className="text-mint-400 mt-1" size={20} />
                <div>
                  <h4 className="font-bold">Fast Setup</h4>
                  <p className="text-sm text-gray-500">
                    Events live in minutes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="text-mint-400 mt-1" size={20} />
                <div>
                  <h4 className="font-bold">Top Quality</h4>
                  <p className="text-sm text-gray-500">
                    Verified event listings.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-700 flex items-center justify-center">
              <Globe className="text-gray-700" size={120} />
              <p className="absolute text-gray-500 font-mono text-xs bottom-4">
                GLOBAL NETWORK VISUALIZATION
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Stats Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-mint-50 rounded-[40px] p-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center space-y-2">
              <p className="text-4xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-mint-800 font-medium uppercase tracking-widest text-xs">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Team / Founder Section (Optional) */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-12">Meet the Visionaries</h2>
        <div className="flex justify-center">
          <div className="group">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden border-4 border-mint-100 group-hover:border-mint-400 transition-colors">
              {/* Replace with your image */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Users size={40} />
              </div>
            </div>
            <h4 className="text-xl font-bold">Aman Yadav</h4>
            <p className="text-gray-500">Founder & CEO</p>
          </div>
        </div>
      </div>
    </div>
  );
}
