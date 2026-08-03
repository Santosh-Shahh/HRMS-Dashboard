import React from 'react';
import { Search, Bell, MessageSquare, LayoutGrid, ChevronsUpDown, ChevronRight } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbs = () => {
    if (pathnames.length === 0) return [{ name: 'Dashboard', path: '/' }];
    
    return pathnames.map((value, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const name = value.charAt(0).toUpperCase() + value.slice(1);
      return { name, path };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-6 w-1/2">
        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center text-sm font-medium text-slate-500 gap-1.5">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.path}>
                <Link
                  to={crumb.path}
                  className={`${isLast ? 'text-slate-900 font-semibold' : 'hover:text-blue-600 transition-colors'}`}
                >
                  {crumb.name}
                </Link>
                {!isLast && <ChevronRight size={14} className="text-slate-400" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none" 
            placeholder="Search employees, documents, or apps..." 
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors">
          <span className="text-sm font-medium text-slate-700">Hunt Digital Media</span>
          <ChevronsUpDown size={14} className="text-slate-400" />
        </button>
        
        <div className="flex items-center gap-3 text-slate-500">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
            <MessageSquare size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <LayoutGrid size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}