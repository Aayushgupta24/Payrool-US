import api from './apiConfig';

export class CopilotService {
  // Add this new method
  async getUsersByCompany() {
    try {
      const selectedCompanyStr = localStorage.getItem('selectedCompany');
      if (!selectedCompanyStr) {
        throw new Error('No company selected');
      }

      const selectedCompany = JSON.parse(selectedCompanyStr);
      const response = await api.post('/reports', {
        method: 'getUsersByCompanyName',
        companyName: selectedCompany.company
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // User Operations
  async getUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  }

  async getUserById(id: string) {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  }

  async createUser(userData: any) {
    const response = await api.post('/admin/users', userData);
    return response.data;
  }

  async updateUser(id: string, userData: any) {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  }

  // Employee Operations
  async getEmployees() {
    const response = await api.get('/api/employees');
    return response.data;
  }

  async addEmployee(employeeData: any) {
    const response = await api.post('/api/employees', employeeData);
    return response.data;
  }

  async updateEmployee(id: string, employeeData: any) {
    const response = await api.put(`/api/employees/${id}`, employeeData);
    return response.data;
  }

  // Document Operations
  async getDocuments() {
    const response = await api.get('/api/documents');
    return response.data;
  }

  // Payroll Operations
  async getPayroll() {
    const response = await api.get('/api/payroll');
    return response.data;
  }

  async runPayroll(payrollData: any) {
    const response = await api.post('/api/payroll/run', payrollData);
    return response.data;
  }
}

export const copilotService = new CopilotService();

