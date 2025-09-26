import React, { useState } from 'react';
import { AppDataStore } from '../types';

export const TerritoryPage: React.FC<{ data: AppDataStore; onChange: (d: AppDataStore)=>void }>=({ data, onChange })=>{
  const [name, setName] = useState('');
  const addAcademy = ()=> onChange({ ...data, academies: [...data.academies, { id: crypto.randomUUID(), nameFr: name }] });

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700">
        <div className="text-lg font-semibold mb-2">Académies</div>
        <div className="flex gap-2">
          <input className="bg-slate-900 border border-slate-700 rounded px-2 py-1" placeholder="Nom" value={name} onChange={e=>setName(e.target.value)} />
          <button className="px-3 py-2 rounded bg-cyan-600" onClick={addAcademy}>Ajouter</button>
        </div>
        <ul className="mt-3 list-disc ml-5">
          {data.academies.map(a=> (<li key={a.id}>{a.nameFr}</li>))}
        </ul>
      </div>
    </div>
  );
};
