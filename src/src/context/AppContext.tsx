import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { employerService } from '../services/employerService';
import { adminService } from '../services/adminService';

interface AppContextType {
  currentRoute: string;
  selectedCompany: any;
  userData: any;
  employeeData: any;
  dashboardStats: any;
  companyList: any[];
  updateSelectedCompany: (company: any) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  currentRoute: '',
  selectedCompany: null,
  userData: null,
  employeeData: null,
  dashboardStats: null,
  companyList: [],
  updateSelectedCompany: () => {},
  refreshData: async () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = useState(location.pathname);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [companyList, setCompanyList] = useState<any[]>([]);

  const refreshData = async () => {
    try {
      // Fetch all relevant data
      const [
        companies,
        employees,
        contractors,
        payrollData,
        bankData
      ] = await Promise.all([
        adminService.getAllCompanies(),
        employerService.getAllEmployees(),
        employerService.getAllContractors(),
        employerService.getPayrollInfo(),
        employerService.getBankBalance()
      ]);

      setCompanyList(companies.data || []);
      setEmployeeData({
        employees: employees.data || [],
        contractors: contractors.data || []
      });
      setDashboardStats({
        payroll: payrollData.data,
        bankBalance: bankData.data?.balance
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  useEffect(() => {
    setCurrentRoute(location.pathname);
    const storedCompany = localStorage.getItem('selectedCompany');
    if (storedCompany) {
      setSelectedCompany(JSON.parse(storedCompany));
    }
    refreshData();
  }, [location]);

  const updateSelectedCompany = (company: any) => {
    setSelectedCompany(company);
    localStorage.setItem('selectedCompany', JSON.stringify(company));
    refreshData();
  };

  return (
    <AppContext.Provider 
      value={{
        currentRoute,
        selectedCompany,
        userData,
        employeeData,
        dashboardStats,
        companyList,
        updateSelectedCompany,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);