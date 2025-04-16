import api from './apiConfig';
import { ApiResponse } from '../types/api';

export interface EmployeeProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  startDate: string;
  department: string;
  position: string;
  employmentType: string;
}

export interface PaystubResponse {
  id: string;
  periodStart: string;
  periodEnd: string;
  grossPay: number;
  netPay: number;
  deductions: Array<{
    type: string;
    amount: number;
  }>;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  type: string;
  status: string;
  uploadedAt: string;
  url: string;
}

export const employeeService = {
  // Profile Management
  getMyProfile: () => 
    api.get<ApiResponse<EmployeeProfile>>('/employee/profile'),
  
  updateMyProfile: (data: Partial<EmployeeProfile>) => 
    api.put<ApiResponse<EmployeeProfile>>('/employee/profile', data),
  
  updatePassword: (passwords: { currentPassword: string; newPassword: string }) => 
    api.put('/employee/password', passwords),

  // Documents
  getMyDocuments: () => 
    api.get<ApiResponse<EmployeeDocument[]>>('/employee/documents'),
  
  uploadDocument: (formData: FormData) => 
    api.post<ApiResponse<EmployeeDocument>>('/employee/documents', formData),
  
  downloadDocument: (documentId: string) => 
    api.get(`/employee/documents/${documentId}/download`),

  // Paystubs
  getMyPaystubs: () => 
    api.get<ApiResponse<PaystubResponse[]>>('/employee/paystubs'),
  
  getPaystubDetails: (paystubId: string) => 
    api.get<ApiResponse<PaystubResponse>>(`/employee/paystubs/${paystubId}`),
  
  downloadPaystub: (paystubId: string) => 
    api.get(`/employee/paystubs/${paystubId}/download`),

  // Time & Attendance
  getTimesheet: (period: { start: string; end: string }) => 
    api.get('/employee/timesheet', { params: period }),
  
  submitTimesheet: (data: any) => 
    api.post('/employee/timesheet', data),

  // Benefits
  getMyBenefits: () => 
    api.get('/employee/benefits'),
  
  enrollInBenefit: (benefitId: string, data: any) => 
    api.post(`/employee/benefits/${benefitId}/enroll`, data),

  // Team
  getTeamMembers: () => 
    api.get('/employee/team'),
  
  getTeamDocuments: () => 
    api.get('/employee/team/documents'),
};