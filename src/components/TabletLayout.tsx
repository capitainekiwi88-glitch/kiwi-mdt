import React from "react";

interface TabletLayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const TabletLayout: React.FC<TabletLayoutProps> = ({ children, noPadding = false }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      
      {/* MODIFICATIONS EFFECTUÉES :
          1. w-[85vw] : Plus large (85% de l'écran)
          2. h-[70vh] : Moins haut (70% de l'écran), pour l'effet rectangulaire
          3. max-w-[1200px] : On autorise une plus grande largeur max
          4. rounded-[1.5rem] : Angles un peu plus carrés
      */}
      <div className="relative pointer-events-auto bg-black rounded-[1.5rem] shadow-2xl border-4 border-zinc-800 p-3 w-[85vw] max-w-[1200px] h-[80vh] flex flex-col items-center justify-center transition-transform duration-300 transform hover:scale-[1.005]">
        
        {/* Caméra Frontale */}
        <div className="absolute top-4 w-3 h-3 bg-zinc-800 rounded-full left-1/2 -translate-x-1/2 z-20 opacity-50" />

        {/* ÉCRAN */}
        {/* On adapte aussi l'arrondi de l'écran intérieur (rounded-xl ou rounded-[1.2rem]) */}
        <div className="relative w-full h-full bg-neutral-950 rounded-[1.2rem] overflow-hidden flex flex-col shadow-inner">
            
            {/* Fond d'écran */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(49,46,129,0.5)_0%,_rgba(10,10,10,1)_80%)]" />

            {/* Contenu */}
            <div className={`relative z-10 w-full h-full overflow-y-auto scrollbar-hide ${noPadding ? '' : 'p-8 pb-12'}`}>
              {children}
            </div>
            
            {/* Logo KiwIFruit */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none">
              <span className="text-white/20 text-[10px] font-bold tracking-[0.3em] uppercase font-sans drop-shadow-md">
                KiwIFruit
              </span>
            </div>

        </div>

        {/* Boutons latéraux (Ajustés pour la nouvelle hauteur) */}
        <div className="absolute -right-[6px] top-16 w-1 h-10 bg-zinc-800 rounded-r-md" />
        <div className="absolute -right-[6px] top-28 w-1 h-10 bg-zinc-800 rounded-r-md" />
        <div className="absolute -top-[6px] right-16 w-10 h-1 bg-zinc-800 rounded-t-md" />

      </div>
    </div>
  );
};