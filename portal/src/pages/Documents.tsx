import React, { useState } from 'react';
import { AppDataStore, DocumentItem } from '../types';
import { aiService } from '../services/aiService';

export const DocumentsPage: React.FC<{ data: AppDataStore; onChange: (d: AppDataStore)=>void }>=({ data, onChange })=>{
  const [file, setFile] = useState<File|null>(null);
  const [meta, setMeta] = useState<Partial<DocumentItem>>({});
  const [loading, setLoading] = useState(false);

  const toBase64 = (f: File)=> new Promise<string>((res,rej)=>{ const r = new FileReader(); r.onload=()=>res(r.result as string); r.onerror=()=>rej(); r.readAsDataURL(f); });

  const analyze = async ()=>{
    if (!file) return; setLoading(true);
    const text = await file.text();
    const prompt = `Propose un titre concis, un domaine (catégorie) et un résumé (3-5 lignes) pour le document suivant. Réponds en JSON avec les clés title, domain, summary.\n\n${text.slice(0,4000)}`;
    const out = await aiService.generateText({ prompt }).catch(()=>"{}");
    try { const parsed = JSON.parse(out); setMeta({ ...meta, ...parsed }); } catch {}
    setLoading(false);
  };

  const save = async ()=>{
    if (!file) return; const base64 = await toBase64(file);
    const doc: DocumentItem = { id: crypto.randomUUID(), title: meta.title||file.name, domain: meta.domain, summary: meta.summary, base64, isTemplate: !!meta.isTemplate };
    onChange({ ...data, documents: [...data.documents, doc] }); setFile(null); setMeta({});
  };

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700">
        <div className="text-lg font-semibold mb-2">Ajouter un document</div>
        <div className="grid md:grid-cols-2 gap-3">
          <input type="file" onChange={e=> setFile(e.target.files?.[0]||null)} />
          <button className="px-3 py-2 rounded bg-slate-700" onClick={analyze} disabled={!file||loading}>{loading? 'Analyse...' : 'Analyser avec IA'}</button>
          <label className="text-sm">Titre<input className="mt-1 w-full bg-slate-900 border border-slate-700 rounded px-2 py-1" value={meta.title||''} onChange={e=>setMeta({...meta, title:e.target.value})}/></label>
          <label className="text-sm">Domaine<input className="mt-1 w-full bg-slate-900 border border-slate-700 rounded px-2 py-1" value={meta.domain||''} onChange={e=>setMeta({...meta, domain:e.target.value})}/></label>
          <label className="text-sm md:col-span-2">Résumé<textarea className="mt-1 w-full bg-slate-900 border border-slate-700 rounded p-2 h-32" value={meta.summary||''} onChange={e=>setMeta({...meta, summary:e.target.value})}/></label>
          <div className="md:col-span-2 flex justify-end"><button className="px-3 py-2 rounded bg-cyan-600" onClick={save} disabled={!file}>Enregistrer</button></div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {data.documents.map(d=> (
          <div key={d.id} className="rounded-xl bg-slate-800/60 p-3 border border-slate-700">
            <div className="font-semibold">{d.title}</div>
            <div className="text-xs text-slate-400">{d.domain||'-'}</div>
            <div className="text-xs mt-2 line-clamp-3">{d.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
