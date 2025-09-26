import React, { useMemo, useState } from 'react';
import { AppDataStore, ID, Report, ReportContent } from '../types';
import { aiService } from '../services/aiService';
import htmlToDocx from 'html-to-docx-ts';

export const ReportsPage: React.FC<{ data: AppDataStore; onChange: (d: AppDataStore)=>void }>=({ data, onChange })=>{
  const [selectedTaskId, setSelectedTaskId] = useState<ID>('');
  const [note, setNote] = useState<number>(0);
  const [sections, setSections] = useState<ReportContent>({});
  const [loading, setLoading] = useState(false);

  const eligibleTasks = useMemo(()=> data.tasks.filter(t=> t.observationGridData), [data.tasks]);

  const generate = async ()=>{
    if (!selectedTaskId) return;
    setLoading(true);
    const task = data.tasks.find(t=>t.id===selectedTaskId)!;
    const teacher = data.teachers.find(x=>x.id===task.teacherId);
    const prompt = `Génère un rapport d'inspection structuré en cinq sections (Leçon, Description, Points positifs, Points à améliorer, Recommandations) à partir de la grille JSON suivante et du contexte enseignant. Rédige en français, style administratif marocain, concis et professionnel.\n\nEnseignant: ${teacher?.lastNameFr} ${teacher?.firstNameFr} (${teacher?.subject}).\nGrille: ${JSON.stringify(task.observationGridData)}`;
    const text = await aiService.generateText({ prompt }).catch(e=>{ alert(e.message); return ''; });
    const parts = text.split(/\n\n+/);
    const content: ReportContent = {
      lesson: parts[0]||'', description: parts[1]||'', pointsPositifs: parts[2]||'', pointsAMeliorer: parts[3]||'', recommandations: parts[4]||''
    };
    const report: Report = { id: crypto.randomUUID(), taskId: task.id, teacherId: task.teacherId!, note, generatedDate: new Date().toISOString(), language: 'FR', content };
    onChange({ ...data, reports: [...data.reports, report] });
    setSections(content);
    setLoading(false);
  };

  const exportDocx = async (rep: Report)=>{
    const html = `<h1>Rapport d'inspection</h1>
    <p>Note: ${rep.note||''}</p>
    <h2>Leçon</h2><div>${rep.content.lesson||''}</div>
    <h2>Description</h2><div>${rep.content.description||''}</div>
    <h2>Points positifs</h2><div>${rep.content.pointsPositifs||''}</div>
    <h2>Points à améliorer</h2><div>${rep.content.pointsAMeliorer||''}</div>
    <h2>Recommandations</h2><div>${rep.content.recommandations||''}</div>`;
    const blob = await htmlToDocx(html, undefined, { table: { row: { cantSplit: true }}});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `rapport_${rep.id}.docx`; a.click(); URL.revokeObjectURL(a.href);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700">
        <div className="text-lg font-semibold mb-3">Génération IA</div>
        <div className="grid md:grid-cols-3 gap-3">
          <label className="text-sm">Tâche
            <select className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={selectedTaskId} onChange={e=>setSelectedTaskId(e.target.value as ID)}>
              <option value="">--</option>
              {eligibleTasks.map(t=>(<option key={t.id} value={t.id}>{new Date(t.date).toLocaleDateString()} - {t.objet}</option>))}
            </select>
          </label>
          <label className="text-sm">Note / 20
            <input type="number" className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-2 py-1" value={note} onChange={e=>setNote(Number(e.target.value))} />
          </label>
          <div className="flex items-end">
            <button className="px-3 py-2 rounded bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50" onClick={generate} disabled={!selectedTaskId||loading}>{loading? 'Génération...' : 'Générer'}</button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Rapports</div>
          <div className="space-y-2">
            {data.reports.map(r=> (
              <div key={r.id} className="border border-slate-700 rounded p-2">
                <div className="text-sm">{new Date(r.generatedDate).toLocaleString()} · Note {r.note||'-'}</div>
                <div className="flex gap-2 mt-2"><button className="text-cyan-400 hover:underline" onClick={()=>exportDocx(r)}>Export .docx</button></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Aperçu</div>
          <div className="prose prose-invert max-w-none">
            <h2>Leçon</h2><div>{sections.lesson}</div>
            <h2>Description</h2><div>{sections.description}</div>
            <h2>Points positifs</h2><div>{sections.pointsPositifs}</div>
            <h2>Points à améliorer</h2><div>{sections.pointsAMeliorer}</div>
            <h2>Recommandations</h2><div>{sections.recommandations}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
