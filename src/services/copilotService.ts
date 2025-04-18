import api from './apiConfig';
import { employerService } from './employerService';
import { adminService, AdminCompanyResponse } from './adminService';

interface ContextData {
  route: string;
  company: any;
  userData: any;
  employeeData: {
    employees: any[];
    contractors: any[];
  };
  dashboardStats: {
    payroll: {
      totalPayroll: number;
      nextPayrollDate: string;
      pendingPayments: number;
      completedPayments: number;
    };
    bankBalance: number;
  };
  companyList: AdminCompanyResponse[];
}

export class CopilotService {
  async getFullContext(): Promise<ContextData> {
    try {
      const storedCompany = localStorage.getItem('selectedCompany');
      const currentRoute = window.location.pathname;
      
      // Get all relevant data
      const contextData: ContextData = {
        route: currentRoute,
        company: storedCompany ? JSON.parse(storedCompany) : null,
        userData: null,
        employeeData: {
          employees: [],
          contractors: []
        },
        dashboardStats: {
          payroll: { totalPayroll: 0, nextPayrollDate: '', pendingPayments: 0, completedPayments: 0 },
          bankBalance: 0
        },
        companyList: []
      };

      // Based on route, fetch relevant data
      if (currentRoute.includes('/admin')) {
        try {
          const companies = await adminService.getAllCompanies();
          if (companies && companies.data) {
            contextData.companyList = companies.data as any[];
          }
        } catch (error) {
          console.error('Error fetching companies:', error);
          // Continue with empty company list
        }
      }

      // Return the context data with default values
      return contextData;
    } catch (error) {
      console.error('Error getting context:', error);
      // Return a default context object
      return {
        route: window.location.pathname,
        company: null,
        userData: null,
        employeeData: {
          employees: [],
          contractors: []
        },
        dashboardStats: {
          payroll: { totalPayroll: 0, nextPayrollDate: '', pendingPayments: 0, completedPayments: 0 },
          bankBalance: 0
        },
        companyList: []
      };
    }
  }

  async getUsersByCompany() {
    const context = await this.getFullContext();
    if (!context.employeeData) {
      throw new Error('No employee data available');
    }

    return {
      total: context.employeeData.employees.length + context.employeeData.contractors.length,
      employees: context.employeeData.employees.length,
      contractors: context.employeeData.contractors.length,
      company: context.company?.company
    };
  }

  async getDashboardStats() {
    const context = await this.getFullContext();
    return context.dashboardStats;
  }

  async getCompanyList() {
    const context = await this.getFullContext();
    return context.companyList;
  }
}

export const copilotService = new CopilotService();
