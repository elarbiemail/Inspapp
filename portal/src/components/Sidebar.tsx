import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';

const NavItem: React.FC<{ to: string; labelKey: string }>=({ to, labelKey })=>{
  const { t } = useI18n();
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link to={to} className={`block px-3 py-2 rounded hover:bg-slate-800 ${active ? 'bg-slate-800 text-cyan-300' : 'text-slate-200'}`}>{t(labelKey)}</Link>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 shrink-0 h-full border-r border-slate-800 bg-slate-900/50 p-3 space-y-1">
      <div className="text-xl font-semibold mb-2">InspApp</div>
      <NavItem to="/" labelKey="nav.dashboard"/>
      <NavItem to="/plan" labelKey="nav.plan"/>
      <NavItem to="/tasks" labelKey="nav.tasks"/>
      <NavItem to="/teachers" labelKey="nav.teachers"/>
      <NavItem to="/reports" labelKey="nav.reports"/>
      <div className="mt-3 text-xs uppercase text-slate-400">Base</div>
      <NavItem to="/territory" labelKey="nav.territory"/>
      <NavItem to="/documents" labelKey="nav.documents"/>
      <div className="mt-3 text-xs uppercase text-slate-400">Outils</div>
      <NavItem to="/assistant" labelKey="nav.assistant"/>
      <NavItem to="/doccenter" labelKey="nav.doccenter"/>
      <div className="mt-3"></div>
      <NavItem to="/settings" labelKey="nav.settings"/>
    </aside>
  );
};
