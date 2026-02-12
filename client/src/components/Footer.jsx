function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto py-4 border-t border-slate-800 bg-[#0f172a]">
      <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-slate-500 text-[11px] font-medium">
          © {year} TaskFlow Workspace.
        </p>
        <div className="flex gap-3 text-[9px] text-slate-600 uppercase tracking-[0.2em] font-bold">
          <span>Focus</span>
          <span className="text-slate-800">•</span>
          <span>Organize</span>
          <span className="text-slate-800">•</span>
          <span>Achieve</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;