/**
 * About Page - Dwello
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const TEAM = [
  { name: 'Aanya Sharma', role: 'Founder & CEO', emoji: '👩‍💼', college: 'IIT Delhi Alumni', bio: 'Struggled to find PG during college. Built Dwello so no student faces the same problem.' },
  { name: 'Rohan Mehta', role: 'Co-Founder & CTO', emoji: '👨‍💻', college: 'BITS Pilani Alumni', bio: 'Full-stack developer passionate about solving real student problems with technology.' },
  { name: 'Priya Nair', role: 'Head of Operations', emoji: '👩‍🔧', college: 'Delhi University Alumni', bio: 'Ensures every listing is verified and every student gets the best experience.' },
  { name: 'Arjun Kapoor', role: 'Head of Growth', emoji: '👨‍📈', college: 'IIM Bangalore Alumni', bio: 'Connects colleges, owners, and students to grow the Dwello community.' },
];

const STATS = [
  { value: '2,000+', label: 'Properties Listed', icon: '🏘️' },
  { value: '50+',    label: 'Cities Covered',    icon: '🗺️' },
  { value: '10,000+',label: 'Students Helped',   icon: '🎓' },
  { value: '500+',   label: 'Verified Owners',   icon: '✅' },
];

const VALUES = [
  { icon: '🔒', title: 'Safety First',      desc: 'Every property is manually verified. We ensure safe and secure accommodations for all students.' },
  { icon: '💰', title: 'Affordable',        desc: 'We help students find quality accommodations within their budget. No hidden charges, full transparency.' },
  { icon: '🤝', title: 'Trust',             desc: 'Genuine reviews from real students. Verified owners. A platform you can count on.' },
  { icon: '⚡', title: 'Easy & Fast',       desc: 'Search, filter, and contact owners in minutes. Finding a home should not be stressful.' },
  { icon: '🌍', title: 'Pan-India',         desc: 'From Delhi to Chennai, Mumbai to Kolkata — we cover colleges across the entire country.' },
  { icon: '📞', title: '24/7 Support',      desc: 'Our team is always here to help students and owners with any questions or concerns.' },
];

const TIMELINE = [
  { year: '2021', title: 'The Idea',        desc: 'Founded by students who faced difficulty finding PG near their college in Delhi.' },
  { year: '2022', title: 'Beta Launch',     desc: 'Launched in Delhi NCR with 50 properties and 200 students in the first month.' },
  { year: '2023', title: 'Rapid Growth',   desc: 'Expanded to 10 cities, 500+ properties, and crossed 5,000 registered students.' },
  { year: '2024', title: 'Going National', desc: 'Present in 50+ cities across India with 2,000+ verified properties.' },
];

const FAQ = [
  { q: 'Is Dwello free for students?',        a: 'Yes! Browsing, searching, and contacting owners is completely free for students. No subscription or hidden fees.' },
  { q: 'How do I know listings are genuine?',     a: 'All properties are manually verified by our team. We check documents, photos, and owner identity before listing.' },
  { q: 'How can owners list their property?',     a: 'Owners can register for free, create a listing with photos and details, and start getting inquiries from students immediately.' },
  { q: 'Can I search by my college name?',        a: 'Absolutely! Just type your college name in the search bar and we will show all nearby PGs and flats.' },
  { q: 'What if I have a problem with an owner?', a: 'Contact our support team immediately. We have a strict policy against fraud and will take action within 24 hours.' },
  { q: 'Which cities are covered?',               a: 'We cover 50+ cities including Delhi, Mumbai, Bangalore, Chennai, Pune, Hyderabad, Kolkata, Jaipur, and more.' },
  { q: 'Can students post their own flat for a roommate?', a: 'Yes! If you already have a flat or PG and want to share it with a fellow student, you can post a "Looking for Roommate" listing. Just register and select the Roommate listing type when posting.' },
];

const About = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <div className="animate-fade-in">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-8 left-8 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-8 right-8 w-56 sm:w-80 h-56 sm:h-80 rounded-full bg-accent-400 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-white/30">
            🏠 Our Story
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            We Help Students Find <br className="hidden sm:block" />
            <span className="text-accent-400">Home Away From Home</span>
          </h1>
          <p className="text-sm sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed px-2">
            Dwello was born from a simple belief — every student deserves a safe, comfortable, and affordable place to live near their college.
          </p>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            {STATS.map(({ value, label, icon }) => (
              <div key={label} className="text-center">
                <div className="text-3xl sm:text-4xl mb-2">{icon}</div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-primary-700">{value}</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Mission ──────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Our Mission</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-800 mt-2 mb-4 leading-tight">
              Making Student Housing Simple, Safe & Affordable
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
              Finding a PG or flat near college is one of the most stressful experiences for students and their families. Long searches, fake listings, unsafe environments — we have all heard the horror stories.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
              Dwello was created to change all of that. We connect students with verified, trusted property owners near their college — making the search fast, transparent, and stress-free.
            </p>
            <button onClick={() => navigate('/properties')} className="btn-primary text-sm">
              Find Your PG Now →
            </button>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-6 sm:p-8 border border-primary-200">
              <div className="space-y-4">
                {[
                  { icon: '🎓', text: 'Built by students, for students' },
                  { icon: '🔍', text: 'Search by your college name' },
                  { icon: '✅', text: 'All listings manually verified' },
                  { icon: '📞', text: 'Direct contact with owners' },
                  { icon: '⭐', text: 'Real reviews from real students' },
                  { icon: '🆓', text: '100% free for students' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <span className="text-sm font-medium text-gray-700">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-accent-500 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-lg">
              🇮🇳 Made in India
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values ───────────────────────────────────────── */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Why Choose Us</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-800 mt-2">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="card p-5 sm:p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
                  {icon}
                </div>
                <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Journey (Timeline) ───────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Our Journey</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-800 mt-2">From Idea to Impact</h2>
        </div>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 transform sm:-translate-x-0.5" />

          <div className="space-y-8 sm:space-y-10">
            {TIMELINE.map(({ year, title, desc }, i) => (
              <div key={year} className={`relative flex gap-4 sm:gap-0 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                {/* Content */}
                <div className={`flex-1 sm:w-5/12 pl-12 sm:pl-0 ${i % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 sm:text-left'}`}>
                  <div className="card p-4 sm:p-5 inline-block w-full sm:w-auto">
                    <span className="badge bg-primary-100 text-primary-700 text-xs mb-2">{year}</span>
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{title}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>

                {/* Dot */}
                <div className="absolute left-4 sm:left-1/2 top-4 w-5 h-5 bg-primary-600 rounded-full border-4 border-white shadow-md transform sm:-translate-x-2.5 flex-shrink-0" />

                {/* Empty side for desktop alternating */}
                <div className="hidden sm:block flex-1 sm:w-5/12" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────── */}
      <section className="bg-primary-900 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-xs font-semibold text-primary-300 uppercase tracking-widest">The People</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-2">Meet Our Team</h2>
            <p className="text-primary-300 text-sm mt-2">All of us were students once. We get it.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {TEAM.map(({ name, role, emoji, college, bio }) => (
              <div key={name} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
                <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto">
                  {emoji}
                </div>
                <h3 className="font-semibold text-white text-center text-sm sm:text-base">{name}</h3>
                <p className="text-primary-300 text-xs text-center mb-1">{role}</p>
                <p className="text-primary-400 text-xs text-center mb-3">🎓 {college}</p>
                <p className="text-primary-200 text-xs leading-relaxed text-center">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">FAQs</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-800 mt-2">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {FAQ.map(({ q, a }, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800 text-sm sm:text-base pr-4">{q}</span>
                <span className={`text-primary-600 text-lg flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 animate-fade-in">
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <section className="bg-gray-50 py-10 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-800">Get in Touch</h2>
            <p className="text-gray-500 text-sm mt-2">We would love to hear from you</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '📧', label: 'Email Us', value: 'hello@Dwello.in', href: 'mailto:hello@Dwello.in' },
              { icon: '📞', label: 'Call Us', value: '+91 98765 43210', href: 'tel:+919876543210' },
              { icon: '📍', label: 'Visit Us', value: 'New Delhi, India', href: '#' },
            ].map(({ icon, label, value, href }) => (
              <a key={label} href={href}
                className="card p-5 text-center hover:shadow-md transition-shadow group">
                <div className="text-3xl mb-3">{icon}</div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm font-medium text-primary-600 group-hover:underline">{value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>


      {/* ── Roommate Listings ────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Visual */}
          <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-3xl p-6 sm:p-8 border border-primary-100">
            <div className="space-y-3">
              {[
                { emoji: '🏠', text: 'Already have a flat near college?' },
                { emoji: '👯', text: 'Looking for a trustworthy roommate?' },
                { emoji: '💸', text: 'Split rent and save money together' },
                { emoji: '📍', text: 'Find roommates from your own college' },
                { emoji: '✅', text: 'Post for free — no charges for students' },
              ].map(({ emoji, text }) => (
                <div key={text} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
                  <span className="text-xl flex-shrink-0">{emoji}</span>
                  <span className="text-sm font-medium text-gray-700">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <span className="text-xs font-semibold text-accent-600 uppercase tracking-widest">New Feature</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-800 mt-2 mb-4 leading-tight">
              Students Can Now Post{' '}
              <span className="text-primary-600">Roommate Listings</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
              Already living in a flat or PG near your college? Have an extra room or bed? Post a <strong>Looking for Roommate</strong> listing and find a fellow student to share with.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
              It is completely free for students. Just register, choose <strong>"Roommate"</strong> as the listing type, add your details, and start getting roommate requests from verified students.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate('/register')} className="btn-primary text-sm">
                👯 Post a Roommate Listing
              </button>
              <button onClick={() => navigate('/properties?type=Roommate')} className="btn-outline text-sm">
                🔍 Find Roommates
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
            Ready to Find Your Perfect PG?
          </h2>
          <p className="text-white/80 text-sm sm:text-base mb-6 px-2">
            Join 10,000+ students who found their home with Dwello
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/properties')}
              className="bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-sm">
              🔍 Browse Properties
            </button>
            <button onClick={() => navigate('/register')}
              className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors text-sm">
              🎓 Sign Up Free
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
