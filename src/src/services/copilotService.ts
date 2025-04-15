import api from './apiConfig';
import { employerService } from './employerService';
import { adminService } from './adminService';

export class CopilotService {
  async getFullContext() {
    try {
      const storedCompany = localStorage.getItem('selectedCompany');
      const currentRoute = window.location.pathname;
      
      // Get all relevant data
      const contextData = {
        route: currentRoute,
        company: storedCompany ? JSON.parse(storedCompany) : null,
        userData: null,
        employeeData: null,
        dashboardStats: null,
        companyList: []
      };

      // Based on route, fetch relevant data
      if (currentRoute.includes('/admin')) {
        const companies = await adminService.getAllCompanies();
        contextData.companyList = companies.data || [];
      }

      if (contextData.company) {
        const [employees, contractors, payroll, bank] = await Promise.all([
          employerService.getAllEmployees(),
          employerService.getAllContractors(),
          employerService.getPayrollInfo(),
          employerService.getBankBalance()
        ]);

        contextData.employeeData = {
          employees: employees.data || [],
          contractors: contractors.data || []
        };

        contextData.dashboardStats = {
          payroll: payroll.data,
          bankBalance: bank.data?.balance
        };
      }

      return contextData;
    } catch (error) {
      console.error('Error getting context:', error);
      throw error;
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


