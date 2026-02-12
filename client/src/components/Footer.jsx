function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto py-10 border-t border-slate-100 bg-white">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-slate-400 text-sm font-medium">
          © {year} TaskFlow Workspace. All rights reserved.
        </p>
        <div className="flex justify-center gap-4 mt-2 text-xs text-slate-300 uppercase tracking-widest font-bold">
          <span>Focus</span>
          <span>•</span>
          <span>Organize</span>
          <span>•</span>
          <span>Achieve</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;