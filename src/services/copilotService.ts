import api from './apiConfig';

export class CopilotService {
  // User Operations
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

      const data = response.data;
      
      if (data && typeof data === 'object') {
        let usersData = [];
        
        if (Array.isArray(data)) {
          usersData = data;
        } else if (Array.isArray(data.users)) {
          usersData = data.users;
        } else if (data.data && Array.isArray(data.data.users)) {
          usersData = data.data.users;
        } else if (data.data && Array.isArray(data.data)) {
          usersData = data.data;
        }

        return usersData;
      }
      throw new Error('Invalid response format');
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Employee Operations
  async addEmployee(employeeData: any) {
    try {
      const selectedCompanyStr = localStorage.getItem('selectedCompany');
      if (!selectedCompanyStr) throw new Error('No company selected');
      
      const selectedCompany = JSON.parse(selectedCompanyStr);
      
      const response = await api.post('https://sandbox.rollfi.xyz/adminPortal', {
        method: 'addUser',
        user: {
          companyId: selectedCompany.companyID,
          userReferenceId: '',
          ...employeeData,
          companyLocationId: ''
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  }

  // Payroll Operations
  async getPayroll() {
    try {
      const response = await employerService.getPayrollHistory();
      return response.data;
    } catch (error) {
      console.error('Error getting payroll:', error);
      throw error;
    }
  }

  async runPayroll(payrollData: any) {
    try {
      const response = await employerService.runPayroll(payrollData);
      return response.data;
    } catch (error) {
      console.error('Error running payroll:', error);
      throw error;
    }
  }

  // Helper method to get user count
  async getUserCount() {
    try {
      const users = await this.getUsersByCompany();
      return users.length;
    } catch (error) {
      console.error('Error getting user count:', error);
      throw error;
    }
  }
}

export const copilotService = new CopilotService();
