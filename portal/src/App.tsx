import React, { useEffect, useMemo, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { I18nProvider } from './i18n/I18nContext';
import { Dashboard } from './pages/Dashboard';
import { TasksPage } from './pages/Tasks';
import { TeachersPage } from './pages/Teachers';
import { ReportsPage } from './pages/Reports';
import { PlanActionPage } from './pages/PlanAction';
import { DocumentsPage } from './pages/Documents';
import { DocumentCenterPage } from './pages/DocumentCenter';
import { TerritoryPage } from './pages/Territory';
import { SettingsPage } from './pages/Settings';
import { AppDataStore } from './types';
import { load, save } from './services/storage';

const emptyStore: AppDataStore = { users: [], academies: [], directions: [], schools: [], teachers: [], tasks: [], reports: [], documents: [], zones: [], planActions: [] };

export const App: React.FC = () => {
  const [data, setData] = useState<AppDataStore>(()=>load(emptyStore));

  useEffect(()=>{ save(data); }, [data]);

  // Réinitialisation annuelle le 1er septembre
  useEffect(()=>{
    const now = new Date();
    const septFirst = new Date(now.getFullYear(), 8, 1);
    const resetKey = `inspapp:reset:${now.getFullYear()}`;
    if (now > septFirst && !localStorage.getItem(resetKey)) {
      setData(d=> ({ ...d, tasks: [], reports: [], planActions: [] }));
      localStorage.setItem(resetKey, '1');
      alert('Nouvelle année scolaire détectée. Données annuelles réinitialisées.');
    }
  }, []);

  return (
    <I18nProvider>
      <HashRouter>
        <div className="h-full flex">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard data={data} />} />
              <Route path="/plan" element={<PlanActionPage data={data} onChange={setData} />} />
              <Route path="/tasks" element={<TasksPage data={data} onChange={setData} />} />
              <Route path="/teachers" element={<TeachersPage data={data} onChange={setData} />} />
              <Route path="/reports" element={<ReportsPage data={data} onChange={setData} />} />
              <Route path="/documents" element={<DocumentsPage data={data} onChange={setData} />} />
              <Route path="/doccenter" element={<DocumentCenterPage />} />
              <Route path="/territory" element={<TerritoryPage data={data} onChange={setData} />} />
              <Route path="/settings" element={<SettingsPage data={data} onChange={setData} />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </I18nProvider>
  );
};
