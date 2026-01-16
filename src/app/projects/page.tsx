import Navigation from '../components/Navigation';

export default function Projects() {
  const projects = [
    {
      title: 'Banco BBVA - Mobile & Web Renewal',
      description: 'Renovated frontend architecture for mobile/web apps using Open Cells. Developed cross-platform features for seamless user experience. Modernized legacy flows into scalable, modular architecture.',
      technologies: ['React', 'Open Cells', 'JavaScript', 'SCSS', 'Fintech'],
      sector: 'Fintech',
      client: 'Banco BBVA',
      location: 'Argentina',
      context: 'Local team in Argentina',
    },
    {
      title: 'Johnson & Johnson - Data Visualization',
      description: 'Created high-performance statistical data app for analytics with React, Redux, and SCSS. Built complex dashboards with Recharts for real-time insights. Ensured UI/UX precision for intuitive visual components.',
      technologies: ['React', 'Redux', 'Recharts', 'SCSS', 'Data Visualization'],
      sector: 'Healthcare & Analytics',
      client: 'Johnson & Johnson',
      location: 'USA',
      context: 'International team with colleagues from USA and Europe.',
      englishCommunication: true,
    },
    {
      title: 'Banco Hipotecario - Core Banking Development',
      description: 'Developed a scalable banking application from scratch. Utilized React, Redux, JavaScript, and SCSS for technological enhancements. Established technical documentation and Code Review protocols, reducing development lead times. Designed dynamic, reusable components for consistency and accessibility.',
      technologies: ['React', 'Redux', 'JavaScript', 'SCSS', 'Agile/SCRUM'],
      sector: 'Fintech',
      client: 'Banco Hipotecario',
      location: 'Argentina',
      context: 'Local team in Argentina',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Projects</h1>
          <p className="text-xl text-gray-400">
            Professional work in Fintech and Healthcare sectors
          </p>
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Projects List */}
        <div className="space-y-10 md:space-y-12">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-lg p-10 md:p-12 hover:border-gray-700 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">{project.title}</h2>
                  <p className="text-gray-400 mb-3 text-lg md:text-xl">
                    {project.sector} • {project.client}
                  </p>
                  <p className="text-gray-500 text-base md:text-lg mb-2">
                    📍 {project.location}
                  </p>
                  <p className="text-gray-500 text-base md:text-lg italic mb-3">
                    {project.context}
                  </p>
                  {project.englishCommunication && (
                    <div className="flex items-center gap-3 mt-4">
                      <span className="px-5 py-2.5 text-white text-base md:text-lg font-bold rounded-full border-2 border-blue-400 shadow-lg">
                        🇺🇸 ENGLISH COMMUNICATION
                      </span>
                      <span className="text-gray-400 text-base md:text-lg">• All team communication in English</span>
                    </div>
                  )}
                </div>
                <span className="px-4 py-2 bg-green-600 text-white text-sm md:text-base font-medium rounded mt-3 md:mt-0">
                  GLOBANT
                </span>
              </div>
              
              <p className="text-gray-300 mb-8 text-lg md:text-xl leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-base md:text-lg text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

