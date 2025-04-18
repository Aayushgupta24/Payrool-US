import api from './apiConfig';
import { utf8ToBase64 } from '../utils/base64';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface EmployerProfile {
  companyName: string;
  ein: string;
  address: string;
  phone: string;
  email: string;
}

export interface PayrollInfo {
  totalPayroll: number;
  nextPayrollDate: string;
  pendingPayments: number;
  completedPayments: number;
}

export interface BankBalance {
  balance: number;
  currency: string;
  lastUpdated: string;
}

export const employerService = {
  // Employee Management
  getAllEmployees: async () => {
    try {
      // Using POST with method parameter instead of GET
      const response = await api.post('/reports', {
        method: 'getAllEmployees'
      });
      return { data: response.data || [] };
    } catch (error) {
      console.error('Error fetching employees:', error);
      return { data: [] };
    }
  },
  
  addEmployee: (employeeData: any) => {
    // Encode name fields to prevent btoa encoding issues
    if (employeeData.firstName) {
      employeeData.firstName = utf8ToBase64(employeeData.firstName);
    }
    if (employeeData.middleName) {
      employeeData.middleName = utf8ToBase64(employeeData.middleName);
    }
    if (employeeData.lastName) {
      employeeData.lastName = utf8ToBase64(employeeData.lastName);
    }
    
    console.log('Encoding employee data with utf8ToBase64 to prevent btoa issues');
    
    return api.post('/employer/employees', employeeData);
  },
  
  updateEmployee: (employeeId: string, data: any) => {
    // Encode name fields to prevent btoa encoding issues
    if (data.firstName) {
      data.firstName = utf8ToBase64(data.firstName);
    }
    if (data.middleName) {
      data.middleName = utf8ToBase64(data.middleName);
    }
    if (data.lastName) {
      data.lastName = utf8ToBase64(data.lastName);
    }
    
    console.log('Encoding employee update data with utf8ToBase64 to prevent btoa issues');
    
    return api.put(`/employer/employees/${employeeId}`, data);
  },

  // Contractor Management
  getAllContractors: async () => {
    try {
      // Using POST with method parameter instead of GET
      const response = await api.post('/reports', {
        method: 'getAllContractors'
      });
      return { data: response.data || [] };
    } catch (error) {
      console.error('Error fetching contractors:', error);
      return { data: [] };
    }
  },
  
  addContractor: (contractorData: any) => {
    // Encode name fields to prevent btoa encoding issues
    if (contractorData.firstName) {
      contractorData.firstName = utf8ToBase64(contractorData.firstName);
    }
    if (contractorData.middleName) {
      contractorData.middleName = utf8ToBase64(contractorData.middleName);
    }
    if (contractorData.lastName) {
      contractorData.lastName = utf8ToBase64(contractorData.lastName);
    }
    
    console.log('Encoding contractor data with utf8ToBase64 to prevent btoa issues');
    
    return api.post('/employer/contractors', contractorData);
  },

  // Payroll
  runPayroll: (payrollData: any) => 
    api.post('/employer/payroll/run', payrollData),
  
  getPayrollHistory: () => 
    api.get('/employer/payroll/history'),

  // Company Settings
  getCompanyProfile: () => 
    api.get<ApiResponse<EmployerProfile>>('/employer/company'),
  
  updateCompanyProfile: (data: Partial<EmployerProfile>) => {
    // Encode company name to prevent btoa encoding issues
    if (data.companyName) {
      data.companyName = utf8ToBase64(data.companyName);
    }
    
    console.log('Encoding company profile data with utf8ToBase64 to prevent btoa issues');
    
    return api.put('/employer/company', data);
  },

  // Benefits Administration
  getBenefitsPlans: () => 
    api.get('/employer/benefits'),
  
  updateBenefitsPlan: (planId: string, data: any) => 
    api.put(`/employer/benefits/${planId}`, data),

  // Tax Documents
  getTaxDocuments: () => 
    api.get('/employer/tax-documents'),
  
  generateW2s: (year: number) => 
    api.post('/employer/tax-documents/w2', { year }),
  
  generate1099s: (year: number) => 
    api.post('/employer/tax-documents/1099', { year }),
    
  // Payroll Information
  getPayrollInfo: async () => {
    try {
      // Using POST with method parameter instead of GET
      const response = await api.post('/reports', {
        method: 'getPayrollInfo'
      });
      return { data: response.data || { totalPayroll: 0, nextPayrollDate: '', pendingPayments: 0, completedPayments: 0 } };
    } catch (error) {
      console.error('Error fetching payroll info:', error);
      return { data: { totalPayroll: 0, nextPayrollDate: '', pendingPayments: 0, completedPayments: 0 } };
    }
  },
    
  // Banking
  getBankBalance: async () => {
    try {
      // Using POST with method parameter instead of GET
      const response = await api.post('/reports', {
        method: 'getBankBalance'
      });
      return { data: response.data || { balance: 0, currency: 'USD', lastUpdated: '' } };
    } catch (error) {
      console.error('Error fetching bank balance:', error);
      return { data: { balance: 0, currency: 'USD', lastUpdated: '' } };
    }
  },
};
