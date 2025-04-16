import { EmployeeDetails } from '../types';

export const employeeDetailsData: EmployeeDetails = {
  // General details
  fullName: 'Russell Washington',
  dateOfBirth: '',
  ssn: null,
  
  // Contact information
  address: '',
  businessPhone: '(845) 837-7575',
  workEmail: 'russell@tex.com',
  
  // Security
  username: 'russell@tex.com',
  password: 'XXXXXXXX',
  
  // Two-Factor authentication
  businessEmailMasked: 'rXXXXXX@tex.com',
  businessPhoneMasked: '(845) XXXXXX',
  
  // Job Details
  employmentType: 'W2',
  jobTitle: 'Director',
  compensation: '$100,000.00/Per Year',
  startDate: '04/08/2024',
  
  // Work Location
  workLocation: ''
};