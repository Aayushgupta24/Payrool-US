export interface Document {
  id: string;
  fileName: string;
  uploadedBy: string;
  dateUploaded: string;
}

export interface StatsCard {
  title: string;
  value: number | string;
}

export interface Company {
  id: string;
  name: string;
  employees: number;
  status: 'active' | 'inactive';
  location: string;
}
