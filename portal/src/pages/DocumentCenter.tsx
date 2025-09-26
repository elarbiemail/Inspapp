import React from 'react';

export const DocumentCenterPage: React.FC = ()=>{
  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700">
          <div className="font-semibold">Bilan annuel</div>
          <div className="text-sm text-slate-400">Synthèse des activités de l'année scolaire.</div>
          <button className="mt-3 px-3 py-2 rounded bg-slate-700">Générer</button>
        </div>
        <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700">
          <div className="font-semibold">Liste des enseignants</div>
          <button className="mt-3 px-3 py-2 rounded bg-slate-700">Exporter .docx</button>
        </div>
      </div>
    </div>
  );
};
