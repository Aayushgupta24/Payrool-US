export interface User {
  companyId: string;
  userReferenceId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfJoin: string;
  workerType: string;
  jobTitle: string;
  companyLocationCategory: string;
  code: string;
  companyLocationId: string;
}

export interface DeactivateUserPayload {
  userId: string;
  exitDate: string;
  personalEmail: string;
  finalPayCheckType: string;
  additionalNotes?: string;
}
