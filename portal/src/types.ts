// Types centraux de l'application (version locale-first)
export type ID = string;

export type Gender = 'M' | 'F';
export type TaskActivity = 'INSPECTION' | 'VISITE' | 'REUNION' | 'FORMATION' | 'AUTRE';
export type TaskStatus = 'PLANIFIEE' | 'EN_COURS' | 'REALISEE' | 'ANNULEE';

export interface InspectorProfile {
  lastNameFr: string; lastNameAr?: string;
  firstNameFr: string; firstNameAr?: string;
  cadre?: string; grade?: string; phone?: string; email?: string;
  academieId?: ID; directionId?: ID; zones?: ID[];
  stampUrl?: string; logoUrl?: string;
}

export interface User { id: ID; login: string; password: string; role: 'INSPECTEUR'; profile: InspectorProfile }

export interface Academie { id: ID; nameFr: string; nameAr?: string }
export interface Direction { id: ID; nameFr: string; nameAr?: string; academieId: ID }

export interface School {
  id: ID; nameFr: string; nameAr?: string; city: string; sector: 'Public'|'Prive';
  cycles: Array<'Prescolaire'|'Primaire'|'College'|'Lycee'>; directionId: ID
}

export interface ScheduleSlot { day: number; start: string; end: string; room?: string }
export interface ScheduleData { slots: ScheduleSlot[] }

export interface Teacher {
  id: ID; firstNameFr: string; lastNameFr: string; firstNameAr?: string; lastNameAr?: string;
  matricule?: string; cin?: string; gender?: Gender; subject?: string; cadre?: string;
  echelle?: number; echelon?: number; dateOfBirth?: string; recruitmentDate?: string;
  schoolId?: ID; schedule?: ScheduleData; lastNote?: number; lastInspectionDate?: string;
  photoBase64?: string; files?: { name: string; data: string }[]; linkedReportId?: ID;
}

export interface Task {
  id: ID; objet: string; nature: TaskActivity; status: TaskStatus; date: string;
  schoolId?: ID; teacherId?: ID; teacherIds?: ID[]; lieu?: string;
  observationGridData?: any; // JSON structure
}

export interface ReportContent { lesson?: string; description?: string; pointsPositifs?: string; pointsAMeliorer?: string; recommandations?: string }
export interface Report { id: ID; taskId: ID; teacherId: ID; classe?: string; note?: number; generatedDate: string; language: 'FR'|'AR'; content: ReportContent }

export interface Zone { id: ID; name: string; etablissementIds: ID[] }

export interface DocumentItem { id: ID; title: string; domain?: string; ref?: string; summary?: string; base64?: string; isTemplate?: boolean }

export interface PlanActionActivity { id: ID; title: string; monthlyCount: number[] } // Sept->Juil 11 mois
export interface PlanActionDomain { id: ID; name: string; activities: PlanActionActivity[] }
export interface PlanAction { id: ID; year: string; domains: PlanActionDomain[] }

export interface AppDataStore {
  users: User[]; academies: Academie[]; directions: Direction[]; schools: School[];
  teachers: Teacher[]; tasks: Task[]; reports: Report[]; documents: DocumentItem[];
  zones: Zone[]; planActions: PlanAction[];
}
