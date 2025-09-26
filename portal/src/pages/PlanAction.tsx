import React, { useState } from 'react';
import { AppDataStore, ID, PlanAction, PlanActionActivity, PlanActionDomain } from '../types';

export const PlanActionPage: React.FC<{ data: AppDataStore; onChange: (d: AppDataStore)=>void }>=({ data, onChange })=>{
  const [domains, setDomains] = useState<PlanActionDomain[]>([{ id: crypto.randomUUID(), name: 'Suivi pédagogique', activities: [] }]);
  const [step, setStep] = useState(1);

  const addActivity = (domainId: ID)=>{
    setDomains(d=> d.map(dom=> dom.id===domainId? { ...dom, activities: [...dom.activities, { id: crypto.randomUUID(), title:'', monthlyCount: Array(11).fill(0) }] } : dom));
  };

  const save = ()=>{
    const pa: PlanAction = { id: crypto.randomUUID(), year: String(new Date().getFullYear()), domains };
    onChange({ ...data, planActions: [...data.planActions, pa] });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700">
        <div className="text-sm text-slate-400">Assistant</div>
        <div className="text-lg font-semibold">Plan d'Action</div>
        <div className="mt-2">Étape {step} / 2</div>
      </div>
      {step===1 && (
        <div className="space-y-4">
          {domains.map(dom=> (
            <div key={dom.id} className="rounded-xl bg-slate-800/60 p-4 border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <input className="bg-transparent text-lg font-semibold" value={dom.name} onChange={e=> setDomains(d=> d.map(x=> x.id===dom.id? { ...x, name: e.target.value } : x))} />
                <button className="px-2 py-1 rounded bg-slate-700" onClick={()=>addActivity(dom.id)}>+ Activité</button>
              </div>
              <div className="space-y-2">
                {dom.activities.map(act=> (
                  <input key={act.id} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1" placeholder="Nom de l'activité" value={act.title} onChange={e=> setDomains(d=> d.map(dm=> dm.id!==dom.id? dm: { ...dm, activities: dm.activities.map(a=> a.id===act.id? { ...a, title: e.target.value }: a) }))} />
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-2"><button className="px-3 py-2 rounded bg-cyan-600" onClick={()=>setStep(2)}>Suivant</button></div>
        </div>
      )}
      {step===2 && (
        <div className="space-y-4">
          {domains.map(dom=> (
            <div key={dom.id} className="rounded-xl bg-slate-800/60 p-4 border border-slate-700 overflow-auto">
              <div className="text-lg font-semibold mb-2">{dom.name}</div>
              <table className="min-w-full text-sm">
                <thead><tr><th className="p-2 text-left">Activité</th>{['Sept','Oct','Nov','Déc','Jan','Fév','Mar','Avr','Mai','Juin','Juil'].map(m=>(<th key={m} className="p-2">{m}</th>))}</tr></thead>
                <tbody>
                  {dom.activities.map(act=> (
                    <tr key={act.id}>
                      <td className="p-2">{act.title}</td>
                      {Array.from({length:11}, (_,i)=> (
                        <td className="p-2" key={i}><input type="number" className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1" value={act.monthlyCount[i]||0} onChange={e=> setDomains(d=> d.map(dm=> dm.id!==dom.id? dm: { ...dm, activities: dm.activities.map(a=> a.id!==act.id? a: { ...a, monthlyCount: a.monthlyCount.map((x,idx)=> idx===i? Number(e.target.value): x) }) }))} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <div className="flex justify-between"><button className="px-3 py-2 rounded border border-slate-700" onClick={()=>setStep(1)}>Retour</button><button className="px-3 py-2 rounded bg-cyan-600" onClick={save}>Enregistrer</button></div>
        </div>
      )}
    </div>
  );
};
