"use client"
import React from 'react';
import { FiUser, FiCode, FiMail, FiGithub, FiLinkedin, FiBriefcase } from 'react-icons/fi';
import { SiMongodb, SiExpress, SiReact, SiNextdotjs, SiTailwindcss, SiStripe, SiCloudinary } from 'react-icons/si';
import Image from 'next/image'; // Import Next.js Image component

// Define the data for the team, faculty, and client
const teamData = [
  {
    name: "Karthik Vishal",
    designation: "Team Lead & Full Stack Developer",
    work: "Authentication, Stripe Integration, Backend API Logic",
    image: "/images/team/karthik.jpg", // Placeholder for image path
    github: "https://github.com/karthik",
    linkedin: "https://linkedin.com/in/karthik-v",
    portfolio: "https://portfolio.karthik.com",
    email: "karthik.v@amrita.edu",
    delay: 0,
  },
  {
    name: "Aisha Sharma",
    designation: "Frontend & UI/UX Specialist",
    work: "Mobile Navigation, Product Cards, Aesthetic Design",
    image: "/images/team/aisha.jpg", // Placeholder for image path
    github: "https://github.com/aisha-s",
    linkedin: "https://linkedin.com/in/aisha-sharma",
    portfolio: "https://portfolio.aisha.com",
    email: "aisha.s@amrita.edu",
    delay: 100,
  },
  {
    name: "Vikram Reddy",
    designation: "Database & System Architect",
    work: "MongoDB Schema Design, API Routes, Cloudinary Integration",
    image: "/images/team/vikram.jpg", // Placeholder for image path
    github: "https://github.com/vikram-r",
    linkedin: "https://linkedin.com/in/vikram-reddy",
    portfolio: "https://portfolio.vikram.com",
    email: "vikram.r@amrita.edu",
    delay: 200,
  },
  {
    name: "Priya Menon",
    designation: "DevOps & Quality Assurance",
    work: "Deployment, Git Workflow, Testing & Debugging",
    image: "/images/team/priya.jpg", // Placeholder for image path
    github: "https://github.com/priya-m",
    linkedin: "https://linkedin.com/in/priya-menon",
    portfolio: "https://portfolio.priya.com",
    email: "priya.m@amrita.edu",
    delay: 300,
  },
];

const facultyAndClientData = [
  {
    title: "Course Faculty & Guide",
    name: "Prof. Dr. Rajesh Kumar",
    description: "Our esteemed faculty member from Amrita Vishwa Vidyapeetham, Coimbatore. He provided invaluable guidance on architectural design, security best practices, and project scope management, ensuring the project meets industry standards for full-stack development.",
    image: "/images/team/rajesh_kumar.jpg", // Placeholder for image path
    icon: <FiBriefcase size={28} className="text-gray-600" />,
    delay: 0,
  },
  {
    title: "Client: Soundarya's Boutique",
    name: "Ms. Soundarya Devi",
    description: "A leading boutique specializing in traditional silk and cotton sarees. The goal was to transform their local business model into a scalable e-commerce platform, enabling online sales and better customer management.",
    image: "/images/team/soundarya_devi.jpg", // Placeholder for image path
    icon: <FiUser size={28} className="text-gray-600" />,
    delay: 100,
  },
];

const techStack = [
  { name: "Next.js", icon: <SiNextdotjs className="text-black" />, desc: "The React framework for production (Server Components)." },
  { name: "React", icon: <SiReact className="text-blue-500" />, desc: "Used for building the user interface." },
  { name: "MongoDB", icon: <SiMongodb className="text-green-600" />, desc: "Flexible NoSQL database for product and order storage." },
  { name: "Express.js", icon: <SiExpress className="text-gray-800" />, desc: "Used indirectly for API routing and server-side logic." },
  { name: "Tailwind CSS", icon: <SiTailwindcss className="text-cyan-500" />, desc: "Utility-first CSS framework for aesthetic and responsive design." },
  { name: "Stripe", icon: <SiStripe className="text-purple-600" />, desc: "Secure payment gateway for checkout and subscription management." },
  { name: "Cloudinary", icon: <SiCloudinary className="text-blue-400" />, desc: "Cloud-based image and video management for product assets." },
];

const modules = [
  "Secure User Authentication & Authorization (NextAuth.js)",
  "Full-featured Shopping Cart & Order Management",
  "Dynamic Product CRUD Operations (Admin Dashboard)",
  "Cloud-based Image Hosting & Optimization (Cloudinary)",
  "Seamless Payment Processing & Webhooks (Stripe)",
  "Targeted Email Newsletter System (Nodemailer)"
];

// Reusable Team Member Card Component
const TeamCard = ({ name, designation, work, image, github, linkedin, portfolio, email, delay }) => (
  <div
    className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center transform transition-all duration-700 ease-out hover:shadow-2xl hover:scale-[1.03] opacity-0 border border-gray-100"
    style={{ animation: `fadeInUp 0.7s ease-out ${delay}ms forwards` }}
  >
    {/* Image Placeholder */}
    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-6 shadow-md border-2 border-[#A52A2A]">
      {image ? (
        <Image 
          src={image} 
          alt={name} 
          width={128} 
          height={128} 
          objectFit="cover" 
          className="rounded-full"
        />
      ) : (
        <FiUser size={48} className="text-gray-500" />
      )}
    </div>

    <h3 className="text-2xl font-bold text-gray-800 mb-1">{name}</h3>
    <p className="text-md text-[#A52A2A] font-semibold mb-2">{designation}</p>
    <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-sm">
      **Key Contributions:** {work}
    </p>

    <div className="mt-6 flex space-x-5">
      {github && <a href={github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors duration-300">
        <FiGithub size={24} />
      </a>}
      {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 transition-colors duration-300">
        <FiLinkedin size={24} />
      </a>}
      {portfolio && <a href={portfolio} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transition-colors duration-300">
        <FiCode size={24} />
      </a>}
      {email && <a href={`mailto:${email}`} className="text-gray-500 hover:text-red-500 transition-colors duration-300">
        <FiMail size={24} />
      </a>}
    </div>
  </div>
);

// This is a Server Component. It fetches data (if needed) and renders the UI.
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-white py-16 px-6 sm:px-10 lg:px-16">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="max-w-[1400px] mx-auto space-y-20">
        
        {/* === HEADER & PROJECT CONTEXT === */}
        <section className="text-center animate-delay-100" style={{ animation: `fadeInUp 0.8s ease-out 0ms forwards` }}>
          <h1 className="text-5xl font-extrabold text-[#8B0000] mb-4 leading-tight">
            Building Soundarya's Boutique: Our Journey
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            A full-stack e-commerce solution born from the innovation and dedication of students at Amrita Vishwa Vidyapeetham, Coimbatore, under expert faculty guidance.
          </p>
        </section>

        {/* === TEAM CARDS === */}
        <section>
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center pb-4 border-b-2 border-[#A52A2A] max-w-2xl mx-auto">
            Our Visionary Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {teamData.map((member, index) => (
              <TeamCard key={index} {...member} delay={member.delay + 200} />
            ))}
          </div>
        </section>

        {/* === FACULTY & CLIENT CARDS === */}
        <section>
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center pb-4 border-b-2 border-[#A52A2A] max-w-2xl mx-auto">
            Guidance & Partnership
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {facultyAndClientData.map((item, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center transform transition-all duration-700 ease-out hover:shadow-2xl opacity-0 border border-gray-100"
                style={{ animation: `fadeInUp 0.7s ease-out ${item.delay + 400}ms forwards` }}
              >
                {/* Image Placeholder */}
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-6 shadow-md border-2 border-gray-300">
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      width={128} 
                      height={128} 
                      objectFit="cover" 
                      className="rounded-full"
                    />
                  ) : (
                    item.icon ? React.cloneElement(item.icon, { size: 48 }) : <FiUser size={48} className="text-gray-500" />
                  )}
                </div>

                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-2xl font-bold text-[#8B0000]">{item.title}</h3>
                </div>
                <p className="text-xl font-semibold text-gray-800 mb-2">{item.name}</p>
                <p className="mt-2 text-gray-600 text-base leading-relaxed max-w-md">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* === TECHNICAL BREAKDOWN (Features & Stack) === */}
        <section className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
          <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center pb-4 border-b-2 border-[#A52A2A] max-w-2xl mx-auto">
            Behind the Scenes: Our Technology & Features
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Tech Stack */}
            <div>
              <h3 className="text-3xl font-bold text-[#A52A2A] mb-6 flex items-center">
                <FiCode className="mr-3" /> Key Technologies
              </h3>
              <ul className="space-y-4">
                {techStack.map((tech, index) => (
                  <li 
                    key={index} 
                    className="flex items-start space-x-4 text-gray-700 opacity-0"
                    style={{ animation: `fadeInUp 0.6s ease-out ${index * 70 + 700}ms forwards` }}
                  >
                    <span className="mt-1 flex-shrink-0">{React.cloneElement(tech.icon, { size: 28 })}</span>
                    <div>
                      <p className="font-semibold text-lg text-gray-900">{tech.name}</p>
                      <p className="text-sm text-gray-500">{tech.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modules & Features */}
            <div className="lg:col-span-2">
              <h3 className="text-3xl font-bold text-[#A52A2A] mb-6 flex items-center">
                <FiBriefcase className="mr-3" /> Core Application Modules
              </h3>
              <ul className="space-y-4">
                {modules.map((mod, index) => (
                  <li 
                    key={index} 
                    className="text-lg text-gray-700 border-l-4 border-[#8B0000] pl-4 py-2 opacity-0 bg-red-50 rounded-r-md shadow-sm"
                    style={{ animation: `fadeInUp 0.6s ease-out ${index * 70 + 900}ms forwards` }}
                  >
                    {mod}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>
        
        {/* === POWERED BY === */}
        <section className="text-center py-10">
            <p className="text-xl font-bold text-gray-700">
                Proudly developed by <span className="text-[#8B0000]">Amrita Vishwa Vidyapeetham</span> students | A Full-Stack E-commerce Group Project
            </p>
        </section>
      </div>
    </main>
  );
}