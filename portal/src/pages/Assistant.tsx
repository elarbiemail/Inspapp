import React, { useState } from 'react';
import { AppDataStore } from '../types';
import { aiService } from '../services/aiService';

export const AssistantPage: React.FC<{ data: AppDataStore }>=({ data })=>{
  const [tab, setTab] = useState<'notifications'|'chat'|'sentiment'>('notifications');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const ask = async ()=>{
    setLoading(true);
    const context = {
      teachers: data.teachers.slice(0,50),
      tasks: data.tasks.slice(0,50),
      reports: data.reports.slice(0,50)
    };
    const prompt = `Tu es un assistant pour un inspecteur pédagogique marocain. Réponds brièvement et précisément à partir des données suivantes JSON si pertinent. Question: ${question}. Données: ${JSON.stringify(context)}`;
    const txt = await aiService.generateText({ prompt }).catch(e=> e.message);
    setAnswer(txt); setLoading(false);
  };

  const pendingReports = data.tasks.filter(t=> t.nature==='INSPECTION' && t.status==='REALISEE' && !data.reports.find(r=>r.taskId===t.id));

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-2 text-sm">
        {['notifications','chat','sentiment'].map(k=>(
          <button key={k} onClick={()=>setTab(k as any)} className={`px-3 py-1 rounded border ${tab===k? 'border-cyan-600 text-cyan-300':'border-slate-700'}`}>{k}</button>
        ))}
      </div>
      {tab==='notifications' && (
        <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700">
          <div className="text-lg font-semibold mb-2">Notifications IA</div>
          <ul className="list-disc ml-5 space-y-1">
            <li>{pendingReports.length} rapport(s) d'inspection non généré(s)</li>
          </ul>
        </div>
      )}
      {tab==='chat' && (
        <div className="space-y-3">
          <textarea className="w-full h-32 bg-slate-900 border border-slate-700 rounded p-2" placeholder="Posez une question..." value={question} onChange={e=>setQuestion(e.target.value)} />
          <div className="flex justify-end"><button className="px-3 py-2 rounded bg-cyan-600 disabled:opacity-50" onClick={ask} disabled={loading}>{loading? 'Analyse...' : 'Envoyer'}</button></div>
          <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700 whitespace-pre-wrap min-h-[120px]">{answer}</div>
        </div>
      )}
      {tab==='sentiment' && (
        <div className="space-y-3">
          <div>Sélectionnez un rapport et collez son contenu ci-dessous pour analyse (prototype).</div>
          <textarea className="w-full h-40 bg-slate-900 border border-slate-700 rounded p-2" placeholder="Contenu du rapport..." />
          <div className="text-sm text-slate-400">Analyseur IA à intégrer (ex: prompt de classification Positif/Neutre/Négatif).</div>
        </div>
      )}
    </div>
  );
};
