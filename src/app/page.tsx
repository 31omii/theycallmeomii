import { ArrowUpRight, XLogo, LinkedinLogo, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";

export default function Home() {
  return (
    <div className="flex flex-col py-12 stagger-children">
      {/* Name */}
      <h1 className="text-2xl font-medium mb-2 text-white dark:text-white light:text-black tracking-tight">
        omii :)
      </h1>
      
      {/* Age */}
      <p className="text-zinc-500 text-sm mb-6">
        21 y/o
      </p>

      {/* Status */}
      <div className="text-sm mb-8 space-y-3 max-w-lg">
        <p className="text-zinc-300">
          currently cloning @{" "}
          <a 
            href="https://tryghost.ai/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            ghost
          </a>
        </p>
        <p className="text-zinc-300">
          prev. co-founded{" "}
          <a 
            href="https://www.raeai.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-violet-400 hover:text-violet-300 transition-colors"
          >
            rae
          </a>
          {" "}- cool desktop buddy/agent
        </p>
        <p className="text-zinc-300">
          i fw oss heavy -{" "}
          <span className="text-zinc-300">raycast</span>,{" "}
          <span className="text-zinc-300">ollama</span>,{" "}
          <span className="text-zinc-300">moltbot</span>
        </p>
      </div>

      {/* About */}
      <div className="text-sm mb-8 max-w-lg border-l-2 border-zinc-800 pl-4 space-y-4">
        <p className="text-zinc-300 leading-relaxed">
        i like building things that actually work in the real world. 
        obsessed with CV, robotics, and making ML go beyond jupyter notebooks.
        </p>
        <p className="text-zinc-300 leading-relaxed">
        either shipping something or deep in a paper i found at 2am.
        </p>
        <p className="text-zinc-400 leading-relaxed">
        aside from that, also into{" "}
        <span className="text-zinc-300">drawing</span>
        <span className="text-zinc-500 mx-1">·</span>
        <span className="text-zinc-300">music</span>
        <span className="text-zinc-500 mx-1">·</span>
        <span className="text-zinc-300">chess</span>
      </p>
        
        {/* Photo grid */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="aspect-square rounded-lg overflow-hidden border border-zinc-800">
            <img 
              src="\images\sukuna.png" 
              alt="" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="aspect-square rounded-lg overflow-hidden border border-zinc-800">
            <img 
              src="\images\jiraiya.jpg" 
              alt="" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="aspect-square rounded-lg overflow-hidden border border-zinc-800">
            <img 
              src="\images\vvg.jpg" 
              alt="" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        
        <p className="text-zinc-400 text-xs pt-2">
          p.s. its hard without agents 
        </p>
      </div>

      {/* Projects */}
      <div className="text-sm mb-8">
        <p className="text-zinc-300">
          projects @{" "}
          <a 
            href="https://github.com/31omii/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-white transition-colors"
          >
            github
            <ArrowUpRight size={10} className="inline ml-0.5 opacity-50" />
          </a>
        </p>
      </div>

      {/* Links */}
      <div className="flex gap-5 text-sm">
        <a 
          href="https://x.com/31omii" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <XLogo size={16} weight="fill" />
          
        </a>
        <a 
          href="https://www.linkedin.com/in/31sarthak/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <LinkedinLogo size={16} weight="fill" />
          <span className="hidden sm:inline">linkedin</span>
        </a>
        <a 
          href="mailto:theomiipatil@gmail.com"
          className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <EnvelopeSimple size={16} />
          <span className="hidden sm:inline">email</span>
        </a>
      </div>
    </div>
  );
}
