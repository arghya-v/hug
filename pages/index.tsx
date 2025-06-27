import Image from 'next/image';
import { Poppins } from 'next/font/google';
import { FaTshirt, FaBook, FaUsers, FaHeartbeat } from 'react-icons/fa';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export default function Home() {
  return (
    <main className={`bg-[#f9f8ff] text-[#1d1d1f] ${poppins.className}`}>
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-6 bg-white shadow-sm relative">
          <div className="text-xl font-semibold text-purple-700">Hug Foundation</div>
        <nav className="flex gap-6 text-sm items-center z-10">
          <a href="#about" className="hover:underline">About</a>
          <a href="#programs" className="hover:underline">Programs</a>
          <a href="#volunteer" className="hover:underline">Volunteer</a>
          <a href="#contact" className="hover:underline">Contact</a>
          <a href="#donate" className="bg-purple-600 text-white rounded-full px-4 py-1 font-medium">Donate Now</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between px-10 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-100 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-xl relative z-10">
          <div className="inline-block px-3 py-1 bg-purple-100 text-purple-600 font-medium rounded-full text-sm mb-3 shadow relative">
            <span className="relative z-10">501(c)(3) Non-Profit Organization</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-5 relative z-10 mt-4">
            Helping{' '}
            <span className="relative inline-block">
              <span className="bg-purple-100 rounded-md absolute inset-0 -z-10 scale-102" aria-hidden="true"></span>
              <span className="relative font-semibold text-purple-800">Underprivileged</span>
            </span>{' '}
            Groups
          </h2>
          <p className="text-gray-600 mb-6 relative z-10">
            Based in Henderson, Nevada, empowering underserved communities through education, wellness, and compassionate outreach.
          </p>
          <div className="flex gap-4 relative z-10">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-md shadow">Get Involved</button>
            <button className="border border-purple-600 text-purple-600 px-6 py-2 rounded-md">Learn More</button>
          </div>
        </div>
        <div className="mt-10 lg:mt-0 relative z-10">
          <div className="absolute -top-6 -left-6 w-full h-full bg-purple-100 rounded-xl z-0"></div>
          <Image src="/219135b4-4bb6-48fe-8b79-184c08f87a0f.png" alt="Hug Logo" width={300} height={300} className="rounded-lg relative z-10 shadow-lg" />
        </div>
      </section>

      {/* Stats */}
      <section className="flex justify-around text-center py-14 bg-[#f9f8ff] text-purple-700 font-semibold text-2xl">
        <div>
          <p>150+</p>
          <p className="text-base text-gray-500">Active Volunteers</p>
        </div>
        <div>
          <p>1k+</p>
          <p className="text-base text-gray-500">Total Donations</p>
        </div>
        <div>
          <p>2</p>
          <p className="text-base text-gray-500">Community Programs</p>
        </div>
        <div>
          <p>EST'24</p>
          <p className="text-base text-gray-500">Established</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-10 py-20 bg-[#f9f8ff]">
        <h2 className="text-3xl font-bold text-center mb-6">About <span className="text-purple-700">Hug Foundation</span></h2>
        <p className="text-center max-w-2xl mx-auto mb-12 text-gray-600">
          A 501(c)(3) non-profit dedicated to supporting underserved communities through educational empowerment, wellness programs, and compassionate outreach.
        </p>
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="font-semibold text-lg text-purple-700 mb-2">Our Mission</h3>
            <p className="text-gray-600 mb-6">
              At Hug Foundation, we champion excellence, empathy, and empowerment—building brighter futures, one hug at a time.
            </p>
            <h3 className="font-semibold text-lg text-purple-700 mb-2">Our Values</h3>
            <ul className="text-gray-600 space-y-2 list-disc list-inside">
              <li>Compassionate Service – Empathy and care in every action</li>
              <li>Inclusive Community – Welcoming all voices and stories</li>
              <li>Leadership Development – Shaping the leaders of tomorrow</li>
              <li>Sustainable Impact – Creating meaningful, lasting change</li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-purple-100 rounded-md shadow">
              <h4 className="font-semibold">Student Volunteers</h4>
              <p className="text-gray-600">Empowering youth leaders with opportunities that build character and enrich lives.</p>
            </div>
            <div className="p-4 bg-purple-100 rounded-md shadow">
              <h4 className="font-semibold">Community Impact</h4>
              <p className="text-gray-600">Supporting communities through accessible, compassionate programming tailored to their needs.</p>
            </div>
            <div className="p-4 bg-purple-100 rounded-md shadow">
              <h4 className="font-semibold">Holistic Approach</h4>
              <p className="text-gray-600">Uplifting individuals by addressing physical, emotional, and educational well-being.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="bg-white px-10 py-20">
        <h2 className="text-3xl font-bold text-center mb-10">Our <span className="text-purple-700">Programs</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-[#f9f8ff] rounded-md shadow flex gap-4 items-start">
            <FaTshirt className="text-purple-600 text-3xl mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Clothing Donation Drives</h3>
              <p className="text-gray-600 mb-2">We collect and distribute gently used apparel — with the exception of undergarments — to individuals and families in need.</p>
              <a href="#" className="text-purple-600 hover:underline">Learn more</a>
            </div>
          </div>
          <div className="p-6 bg-[#f9f8ff] rounded-md shadow flex gap-4 items-start">
            <FaBook className="text-purple-600 text-3xl mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Educational Support</h3>
              <p className="text-gray-600 mb-2">Providing tutoring, mentorship, and educational resources to support academic success in underserved communities.</p>
              <a href="#" className="text-purple-600 hover:underline">Apply now →</a>
            </div>
          </div>
          <div className="p-6 bg-[#f9f8ff] rounded-md shadow flex gap-4 items-start">
            <FaUsers className="text-purple-600 text-3xl mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Leadership Development</h3>
              <p className="text-gray-600 mb-2">Creating opportunities for students to develop leadership skills through meaningful volunteer experiences.</p>
              <a href="#" className="text-purple-600 hover:underline">Apply now →</a>
            </div>
          </div>
          <div className="p-6 bg-[#f9f8ff] rounded-md shadow flex gap-4 items-start">
            <FaHeartbeat className="text-purple-600 text-3xl mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Wellness Initiatives</h3>
              <p className="text-gray-600 mb-2">Promoting physical and mental wellbeing through accessible health resources and community programs.</p>
              <a href="#" className="text-purple-600 hover:underline">Apply now →</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
