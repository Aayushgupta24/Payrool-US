import api from './apiConfig';
import { ApiResponse } from '../types/api';

export interface EmployerProfile {
  companyName: string;
  ein: string;
  address: string;
  phone: string;
  email: string;
}

export const employerService = {
  // Employee Management
  getAllEmployees: () => 
    api.get('/employer/employees'),
  
  addEmployee: (employeeData: any) => 
    api.post('/employer/employees', employeeData),
  
  updateEmployee: (employeeId: string, data: any) => 
    api.put(`/employer/employees/${employeeId}`, data),

  // Contractor Management
  getAllContractors: () => 
    api.get('/employer/contractors'),
  
  addContractor: (contractorData: any) => 
    api.post('/employer/contractors', contractorData),

  // Payroll
  runPayroll: (payrollData: any) => 
    api.post('/employer/payroll/run', payrollData),
  
  getPayrollHistory: () => 
    api.get('/employer/payroll/history'),

  // Company Settings
  getCompanyProfile: () => 
    api.get<ApiResponse<EmployerProfile>>('/employer/company'),
  
  updateCompanyProfile: (data: Partial<EmployerProfile>) => 
    api.put('/employer/company', data),

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
};