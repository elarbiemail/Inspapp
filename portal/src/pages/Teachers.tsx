import React, { useMemo, useState } from 'react';
import { AppDataStore, ID, Teacher } from '../types';

const emptyTeacher: Teacher = { id: crypto.randomUUID(), firstNameFr: '', lastNameFr: '' };

export const TeachersPage: React.FC<{ data: AppDataStore; onChange: (d: AppDataStore)=>void }>=({ data, onChange })=>{
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState<'perso'|'pro'|'affect'|'suivi'>('perso');
  const [form, setForm] = useState<Teacher>({...emptyTeacher});
  const schoolTeachers = useMemo(()=> data.teachers.filter(t=>t.schoolId===form.schoolId), [data.teachers, form.schoolId]);

  const submit = ()=>{
    const exists = data.teachers.find(t=>t.id===form.id);
    const teachers = exists ? data.teachers.map(t=> t.id===form.id? form: t) : [...data.teachers, form];
    onChange({ ...data, teachers }); setModalOpen(false); setForm({ ...emptyTeacher, id: crypto.randomUUID() });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Enseignants</h2>
        <button className="px-3 py-2 bg-cyan-600 rounded hover:bg-cyan-700" onClick={()=>setModalOpen(true)}>Nouvel enseignant</button>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {data.teachers.map(t=> (
          <div key={t.id} className="rounded-xl bg-slate-800/60 p-3 border border-slate-700">
            <div className="font-semibold">{t.lastNameFr} {t.firstNameFr}</div>
            <div className="text-xs text-slate-400">{t.subject || '-'}</div>
            <div className="mt-2 flex gap-2">
              <button className="text-cyan-400 hover:underline" onClick={()=>{ setForm(t); setModalOpen(true); }}>Modifier</button>
              <button className="text-rose-400 hover:underline" onClick={()=> onChange({ ...data, teachers: data.teachers.filter(x=>x.id!==t.id) })}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 grid place-items-center">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 w-full max-w-3xl">
            <div className="text-lg font-semibold mb-3">{form.id in data.teachers? 'Modifier' : 'Créer'} un enseignant</div>
            <div className="flex gap-2 text-sm mb-3">
              {['perso','pro','affect','suivi'].map(k=>(
                <button key={k} onClick={()=>setTab(k as any)} className={`px-3 py-1 rounded border ${tab===k? 'border-cyan-600 text-cyan-300':'border-slate-700'}`}>{k}</button>
              ))}
            </div>
            {tab==='perso' && (
              <div className="grid md:grid-cols-2 gap-3">
                <label className="text-sm">Nom FR<input className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.lastNameFr} onChange={e=>setForm({...form, lastNameFr:e.target.value})}/></label>
                <label className="text-sm">Prénom FR<input className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.firstNameFr} onChange={e=>setForm({...form, firstNameFr:e.target.value})}/></label>
                <label className="text-sm">Nom AR<input className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.lastNameAr||''} onChange={e=>setForm({...form, lastNameAr:e.target.value})}/></label>
                <label className="text-sm">Prénom AR<input className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.firstNameAr||''} onChange={e=>setForm({...form, firstNameAr:e.target.value})}/></label>
                <label className="text-sm">CIN<input className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.cin||''} onChange={e=>setForm({...form, cin:e.target.value})}/></label>
                <label className="text-sm">Genre<select className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.gender||''} onChange={e=>setForm({...form, gender:e.target.value as any})}><option value="">--</option><option value="M">M</option><option value="F">F</option></select></label>
              </div>
            )}
            {tab==='pro' && (
              <div className="grid md:grid-cols-3 gap-3">
                <label className="text-sm">Matière<input className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.subject||''} onChange={e=>setForm({...form, subject:e.target.value})}/></label>
                <label className="text-sm">Cadre<input className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.cadre||''} onChange={e=>setForm({...form, cadre:e.target.value})}/></label>
                <label className="text-sm">Échelle<input type="number" className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.echelle||0} onChange={e=>setForm({...form, echelle:Number(e.target.value)})}/></label>
              </div>
            )}
            {tab==='affect' && (
              <div className="grid md:grid-cols-2 gap-3">
                <label className="text-sm">Établissement<select className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.schoolId||''} onChange={e=>setForm({...form, schoolId:e.target.value as ID})}><option value="">--</option>{data.schools.map(s=>(<option key={s.id} value={s.id}>{s.nameFr}</option>))}</select></label>
              </div>
            )}
            {tab==='suivi' && (
              <div className="grid md:grid-cols-2 gap-3">
                <label className="text-sm">Dernière note<input type="number" className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.lastNote||0} onChange={e=>setForm({...form, lastNote:Number(e.target.value)})}/></label>
                <label className="text-sm">Dernière date<input type="date" className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={form.lastInspectionDate?.slice(0,10)||''} onChange={e=>setForm({...form, lastInspectionDate:new Date(e.target.value).toISOString()})}/></label>
              </div>
            )}
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
