export interface EmployeeDetails {
    // General details
    fullName: string;
    dateOfBirth: string;
    ssn: string | null;
    
    // Contact information
    address: string;
    businessPhone: string;
    workEmail: string;
    
    // Security
    username: string;
    password: string;
    
    // Two-Factor authentication
    businessEmailMasked: string;
    businessPhoneMasked: string;
    
    // Job Details
    employmentType: string;
    jobTitle: string;
    compensation: string;
    startDate: string;
    
    // Work Location
    workLocation: string;
  }