import Navigation from '../components/Navigation';
import Dither from '../components/Dither';
import Image from 'next/image';

export default function Profile() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Fondo animado con Dither */}
      <Dither
        waveColor={[1, 0.5, 0]}
        disableAnimation={false}
        enableMouseInteraction={true}
        mouseRadius={0.25}
        colorNum={16}
        waveAmplitude={0.2}
        waveFrequency={1.5}
        waveSpeed={0.02}
        pixelSize={1}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Profile</h1>
          <p className="text-xl text-gray-400">
            Senior Frontend Engineer with 5+ years of experience
          </p>
        </div>

        {/* Navigation */}
        <Navigation />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10 md:space-y-12">
            {/* About Section */}
            <section className="backdrop-blur-md bg-black/40 border border-white/10 rounded-lg p-10 md:p-12 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About</h2>
              <p className="text-gray-300 leading-relaxed text-lg md:text-xl">
                Senior Frontend Engineer with 5+ years of experience specializing in the React ecosystem. 
                Background in Cognitive Psychology, providing a unique edge in building intuitive UX/UI and 
                leading high-performance teams. Proven track record in the Fintech and Healthcare sectors, 
                delivering scalable architectures for global clients.
              </p>
            </section>

            {/* Employment History */}
            <section className="backdrop-blur-md bg-black/40 border border-white/10 rounded-lg p-10 md:p-12 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Employment History</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl md:text-3xl font-semibold">Senior Software Engineer</h3>
                    <span className="px-3 py-1.5 bg-green-600 text-white text-sm md:text-base font-medium rounded">
                      PRESENT
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4 text-lg md:text-xl">Globant • June 2021 - Present</p>
                  <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                    Leading frontend development for major clients in Fintech and Healthcare sectors. 
                    Specializing in React ecosystem, scalable architectures, and high-performance applications.
                  </p>
                </div>
              </div>
            </section>

            {/* Education */}
            <section className="backdrop-blur-md bg-black/40 border border-white/10 rounded-lg p-10 md:p-12 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Education</h2>
              
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl md:text-3xl font-semibold">Coding Bootcamp</h3>
                  <span className="px-3 py-1.5 bg-red-600 text-white text-sm md:text-base font-bold rounded">
                    P5
                  </span>
                </div>
                <p className="text-gray-400 mb-2 text-lg md:text-xl">Plataforma 5</p>
                <p className="text-base md:text-lg text-gray-500 mb-6">January - April 2021</p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-base md:text-lg text-gray-300">
                    React
                  </span>
                  <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-base md:text-lg text-gray-300">
                    JavaScript
                  </span>
                  <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-base md:text-lg text-gray-300">
                    Node
                  </span>
                  <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-base md:text-lg text-gray-300">
                    SASS
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 md:space-y-10">
            {/* Profile Photo */}
            <section className="backdrop-blur-md bg-black/40 border border-white/10 rounded-lg p-8 md:p-10 shadow-2xl">
              <div className="flex justify-center">
                <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-gray-700">
                  <Image
                    src="/profile.png"
                    alt="Lucas Diaz Cano"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </section>

            {/* Contact Info */}
            <section className="backdrop-blur-md bg-black/40 border border-white/10 rounded-lg p-8 md:p-10 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Contact</h2>
              <div className="space-y-4 text-base md:text-lg">
                <div className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>(+54 9) 3874474789</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:lucasdiazcanoup@gmail.com" className="hover:text-white transition-colors">
                    lucasdiazcanoup@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Buenos Aires, Argentina</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </div>
              </div>
            </section>

            {/* Skills */}
            <section className="backdrop-blur-md bg-black/40 border border-white/10 rounded-lg p-8 md:p-10 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Skills</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-400 mb-3">Technical</h3>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-base md:text-lg text-gray-300">
                      JavaScript
                    </span>
                    <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-base md:text-lg text-gray-300">
                      React.js
                    </span>
                    <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-base md:text-lg text-gray-300">
                      Node.js
                    </span>
                    <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-base md:text-lg text-gray-300">
                      CSS/SASS
                    </span>
                    <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-base md:text-lg text-gray-300">
                      Redux
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-400 mb-3">Professional</h3>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-base md:text-lg text-gray-300">
                      Agile/SCRUM
                    </span>
                    <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-base md:text-lg text-gray-300">
                      Technical Writing
                    </span>
                    <span className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-base md:text-lg text-gray-300">
                      R&D
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

