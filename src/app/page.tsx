import Link from "next/link";
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiVercel, SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { GoArrowRight } from "react-icons/go";
import { BiCodeAlt } from "react-icons/bi";
import { MdOutlineDevices } from "react-icons/md";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Left Content */}
              <div className="lg:col-span-6 space-y-8">            
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Olá Zaply, eu sou<br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">Bruno Caceres</span>
                </h1>
                
                <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-xl">
                  Sou o desenvolvedor front-end que vai surpreender vocês com esse projeto do desafio. Dá uma olhada no botão aqui embaixo para ir direto pra página de produtos!
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    href="/products"
                    className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-600/30"
                  >
                    Ver produtos
                    <GoArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <a
                    href="https://github.com/BCaceress/Desafio_Frontend_Zaply.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-all shadow-sm"
                  >
                    <SiGithub className="w-4 h-4" />
                    GitHub
                  </a>
                </div>
              </div>
              
              {/* Right Content */}
              <div className="lg:col-span-6">
                <div className="relative">
                  <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
                  
                  <div className="relative backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <BiCodeAlt className="mr-2 text-orange-500" /> Tecnologias & Ferramentas
                    </h2>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { name: "Next.js", icon: <SiNextdotjs className="text-black dark:text-white" /> },
                        { name: "TypeScript", icon: <SiTypescript className="text-blue-500" /> },
                        { name: "Tailwind", icon: <SiTailwindcss className="text-teal-500" /> },
                        { name: "Responsive", icon: <MdOutlineDevices className="text-purple-500" /> },
                        { name: "GitHub", icon: <SiGithub className="text-gray-800 dark:text-gray-200" /> },
                        { name: "Vercel", icon: <SiVercel className="text-black dark:text-white" /> },
                      ].map((skill, index) => (
                        <div 
                          key={index} 
                          className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 flex items-center gap-3 transition-all hover:-translate-y-1 hover:shadow-md"
                        >
                          <div className="text-xl">{skill.icon}</div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{skill.name}</h3>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        Todas as dependências atualizadas
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-3 md:mb-0">
              <div>
                <p className="text-base font-medium text-gray-900 dark:text-white">© {new Date().getFullYear()} Bruno Caceres</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Desenvolvido com Next.js, TypeScript e Tailwind CSS</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              <a href="https://github.com/BCaceress" target="_blank" rel="noopener noreferrer" 
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">
                <SiGithub size={18} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/brunocaceress/" target="_blank" rel="noopener noreferrer" 
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 ">
                <FaLinkedin size={18} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
