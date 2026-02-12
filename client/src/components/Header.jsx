function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-center items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xs">TD</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-slate-800 uppercase">
            Task<span className="text-indigo-600">Flow</span>
          </h1>
        </div>
      </div>
    </nav>
  );
}

export default Header;