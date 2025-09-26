import React, { useEffect, useState } from 'react';
import { AppDataStore } from '../types';

export const SettingsPage: React.FC<{ data: AppDataStore; onChange: (d: AppDataStore)=>void }>=({ data, onChange })=>{
  const [json, setJson] = useState('');
  useEffect(()=>{ setJson(JSON.stringify(data, null, 2)); }, [data]);

  const onImport = ()=>{
    try { const parsed = JSON.parse(json) as AppDataStore; onChange(parsed); } catch { alert('JSON invalide'); }
  };

  const onExport = ()=>{
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `inspapp_backup_${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(a.href);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700">
        <div className="text-lg font-semibold mb-3">Données (export/import JSON)</div>
        <div className="flex gap-2 mb-2">
          <button className="px-3 py-2 rounded bg-slate-700" onClick={onExport}>Exporter</button>
          <button className="px-3 py-2 rounded bg-cyan-600" onClick={onImport}>Importer</button>
        </div>
        <textarea className="w-full h-96 bg-slate-900 border border-slate-700 rounded p-2" value={json} onChange={e=>setJson(e.target.value)} />
      </div>
    </div>
  );
};
