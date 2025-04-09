import { api } from './apiConfig';
import { ApiResponse } from '../types/api';

export interface AdminCompanyResponse {
  companyID: string;
  company: string;
}

export interface AdminUserResponse {
  id: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

export const adminService = {
  // Company Management
  getAllCompanies: async () => {
    try {
      const response = await api.get<{ Company: AdminCompanyResponse[] }>('/reports/getCompanies');
      
      // More robust data validation
      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Handle different possible response formats
      let companies: AdminCompanyResponse[] = [];
      
      if (Array.isArray(response.data)) {
        companies = response.data;
      } else if (Array.isArray(response.data.Company)) {
        companies = response.data.Company;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        companies = response.data.data;
      } else {
        throw new Error('Companies data is not in expected format');
      }

      return { data: companies };
    } catch (error: any) {
      console.error('getAllCompanies error:', error);
      return { 
        data: [],
        error: error.message || 'Failed to fetch companies'
      };
    }
  },
  
  getCompanyDetails: (companyId: string) => 
    api.get<ApiResponse<AdminCompanyResponse>>(`/reports/companies/${companyId}`),
  
  updateCompanyStatus: (companyId: string, status: string) => 
    api.put(`/reports/companies/${companyId}/status`, { status }),

  // User Management
  getAllUsers: () => 
    api.get<ApiResponse<AdminUserResponse[]>>('/admin/users'),
  
  createAdminUser: (userData: { email: string; role: string; }) => 
    api.post('/admin/users', userData),
  
  updateUserStatus: (userId: string, status: string) => 
    api.put(`/admin/users/${userId}/status`, { status }),

  // Analytics & Reporting
  getSystemStats: () => 
    api.get('/admin/stats'),
  
  getAuditLogs: (filters: any) => 
    api.get('/admin/audit-logs', { params: filters }),

  // Settings & Configuration
  getSystemSettings: () => 
    api.get('/admin/settings'),
  
  updateSystemSettings: (settings: any) => 
    api.put('/admin/settings', settings),
};





















