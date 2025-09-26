import React, { useMemo, useState } from 'react';
import { AppDataStore, ID, Task, TaskActivity, TaskStatus } from '../types';

const empty: Task = { id: crypto.randomUUID(), objet: '', nature: 'INSPECTION', status: 'PLANIFIEE', date: new Date().toISOString() };

export const TasksPage: React.FC<{ data: AppDataStore; onChange: (data: AppDataStore)=>void }>=({ data, onChange })=>{
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Task>({...empty});

  const submit = ()=>{
    const exists = data.tasks.find(t=>t.id===form.id);
    const tasks = exists ? data.tasks.map(t=> t.id===form.id? form: t) : [...data.tasks, form];
    onChange({ ...data, tasks });
    setModalOpen(false);
    setForm({ ...empty, id: crypto.randomUUID() });
  };

  const teachersBySchool = useMemo(()=> data.teachers.filter(t=>t.schoolId===form.schoolId), [form.schoolId, data.teachers]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Tâches</h2>
        <button className="px-3 py-2 bg-cyan-600 rounded hover:bg-cyan-700" onClick={()=>setModalOpen(true)}>Nouvelle tâche</button>
      </div>

      <div className="overflow-auto border border-slate-700 rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Objet</th>
              <th className="p-2 text-left">Nature</th>
              <th className="p-2 text-left">Statut</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.tasks.map(t=> (
              <tr key={t.id} className="odd:bg-slate-900/40">
                <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
                <td className="p-2">{t.objet}</td>
                <td className="p-2">{t.nature}</td>
                <td className="p-2">{t.status}</td>
                <td className="p-2">
                  <button className="text-cyan-400 hover:underline mr-2" onClick={()=>{ setForm(t); setModalOpen(true); }}>Modifier</button>
                  <button className="text-rose-400 hover:underline" onClick={()=> onChange({ ...data, tasks: data.tasks.filter(x=>x.id!==t.id) })}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 grid place-items-center">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 w-full max-w-2xl">
            <div className="text-lg font-semibold mb-3">{form.id in data.tasks? 'Modifier' : 'Créer'} une tâche</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-sm">
                Objet
                <input className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.objet} onChange={e=>setForm({...form, objet: e.target.value})} />
              </label>
              <label className="text-sm">
                Date
                <input type="date" className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.date.slice(0,10)} onChange={e=>setForm({...form, date: new Date(e.target.value).toISOString()})} />
              </label>
              <label className="text-sm">
                Nature
                <select className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.nature} onChange={e=>setForm({...form, nature: e.target.value as TaskActivity})}>
                  {['INSPECTION','VISITE','REUNION','FORMATION','AUTRE'].map(n=>(<option key={n} value={n}>{n}</option>))}
                </select>
              </label>
              <label className="text-sm">
                Statut
                <select className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.status} onChange={e=>setForm({...form, status: e.target.value as TaskStatus})}>
                  {['PLANIFIEE','EN_COURS','REALISEE','ANNULEE'].map(n=>(<option key={n} value={n}>{n}</option>))}
                </select>
              </label>
              <label className="text-sm md:col-span-2">
                Lieu
                <input className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.lieu||''} onChange={e=>setForm({...form, lieu: e.target.value})} />
              </label>

              {form.nature !== 'REUNION' ? (
                <label className="text-sm">
                  Enseignant
                  <select className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.teacherId||''} onChange={e=>setForm({...form, teacherId: e.target.value as ID})}>
                    <option value="">--</option>
                    {teachersBySchool.map(t=>(<option key={t.id} value={t.id}>{t.lastNameFr} {t.firstNameFr}</option>))}
                  </select>
                </label>
              ) : (
                <label className="text-sm md:col-span-2">
                  Participants (maintenez Ctrl pour multi-sélection)
                  <select multiple className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 h-32" value={form.teacherIds||[]} onChange={e=>{
                    const opts = Array.from(e.target.selectedOptions).map(o=>o.value as ID);
                    setForm({...form, teacherIds: opts});
                  }}>
                    {teachersBySchool.map(t=>(<option key={t.id} value={t.id}>{t.lastNameFr} {t.firstNameFr}</option>))}
                  </select>
                </label>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-2 rounded border border-slate-700" onClick={()=>setModalOpen(false)}>Annuler</button>
              <button className="px-3 py-2 rounded bg-cyan-600 hover:bg-cyan-700" onClick={submit}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
