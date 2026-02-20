function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-6 py-3 flex justify-start items-center">
        
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-black text-[10px]">TD</span>
          </div>
          <h1 className="text-lg font-black tracking-tighter text-white uppercase">
            Task<span className="text-indigo-400">Flow</span>
          </h1>
        </div>

      </div>
    </nav>
  );
}

export default Header;