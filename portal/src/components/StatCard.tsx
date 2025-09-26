import React from 'react';

export const StatCard: React.FC<{ title: string; value: string|number; hint?: string }>=({ title, value, hint })=>{
  return (
    <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700">
      <div className="text-sm text-slate-400">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
    </div>
  );
};
