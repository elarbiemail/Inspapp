import React from 'react';
import { StatCard } from '../components/StatCard';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from 'recharts';
import { AppDataStore } from '../types';

const COLORS = ['#0ea5e9','#22c55e','#eab308','#ef4444'];

export const Dashboard: React.FC<{data: AppDataStore}> = ({ data }) => {
  const totalTeachers = data.teachers.length;
  const totalTasks = data.tasks.length;
  const realized = data.tasks.filter(t=>t.status==='REALISEE').length;
  const rate = totalTasks? Math.round((realized/totalTasks)*100):0;

  const tasksByNature = Object.entries(
    data.tasks.reduce<Record<string, number>>((acc, t)=>{ acc[t.nature]=(acc[t.nature]||0)+1; return acc; }, {})
  ).map(([name, value])=>({ name, value }));

  const monthly = Array.from({length:12}, (_,i)=>({ m: i+1, c: data.tasks.filter(t=> new Date(t.date).getMonth()===i).length }));

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Enseignants" value={totalTeachers} />
        <StatCard title="Tâches" value={totalTasks} />
        <StatCard title="Taux de réalisation" value={`${rate}%`} />
        <StatCard title="Rapports" value={data.reports.length} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700 h-80">
          <div className="text-sm text-slate-400 mb-2">Répartition par nature</div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={tasksByNature} dataKey="value" nameKey="name" innerRadius={50} outerRadius={70}>
                {tasksByNature.map((entry, idx)=>(<Cell key={idx} fill={COLORS[idx%COLORS.length]} />))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700 h-80">
          <div className="text-sm text-slate-400 mb-2">Activités par mois</div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <XAxis dataKey="m" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Bar dataKey="c" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
