import { SystemPrompt } from '@copilotkit/shared';
import { GroqClient } from '../../utils/groqClient';
import { copilotService } from '../../services/copilotService';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

const groqClient = new GroqClient(process.env.GROQ_API_KEY);

const hiringSystemPrompt = `When handling employee creation:

1. When user asks to add an employee, first explain the required fields and then ask for them in a structured way:
   Required fields:
   - First Name
   - Last Name
   - Email
   - Phone Number
   - Date of Join
   - Worker Type (W2 or 1099)
   - Job Title
   - Location Category (Remote or On-site)
   - State Code (e.g., FL, CA)
   - Salary

2. After collecting information, confirm with the user and use addNewEmployee action.

Example conversation flow:
User: "I want to add a new employee"
Assistant: "I'll help you add a new employee. I need some information:
1. What is the employee's first and last name?
(After user responds, continue with next field)
2. What is their email address?
(Continue until all required fields are collected)"

3. For validation:
- Email should be in valid format
- Phone number should be 10 digits
- Date should be in YYYY-MM-DD format
- State code should be valid US state code
- Salary should be a positive number

4. If any information is missing or invalid, ask for it specifically.`;

const systemPrompt = {
  content: hiringSystemPrompt,
  role: 'system'
};

export async function handler(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;
    const lastMessage = messages[messages.length - 1].content;

    // Get full context for better responses
    const context = await copilotService.getFullContext();

    // Handle different types of queries based on context
    if (lastMessage.toLowerCase().includes('how many')) {
      const counts = await copilotService.getUsersByCompany();
      return new Response(JSON.stringify({ 
        response: `Your company ${counts.company} currently has:
- ${counts.employees} full-time employees
- ${counts.contractors} contractors
- ${counts.total} total team members`
      }));
    }

    if (lastMessage.toLowerCase().includes('dashboard') || 
        lastMessage.toLowerCase().includes('stats')) {
      const stats = await copilotService.getDashboardStats();
      return new Response(JSON.stringify({ 
        response: `Current dashboard statistics:
- Bank Balance: $${stats.bankBalance}
- Next Payroll: $${stats.payroll.amount}
- Next Payroll Date: ${stats.payroll.date}`
      }));
    }

    if (lastMessage.toLowerCase().includes('companies')) {
      const companies = await copilotService.getCompanyList();
      return new Response(JSON.stringify({ 
        response: `Available companies:
${companies.map(c => `- ${c.company}`).join('\n')}`
      }));
    }

    // Default response using Groq
    const completion = await groqClient.createCompletion([
      ...messages,
      { role: 'system', content: `Current context:
Route: ${context.route}
Company: ${context.company?.company || 'None selected'}
Employees: ${context.employeeData?.employees.length || 0}
Contractors: ${context.employeeData?.contractors.length || 0}`
      }
    ]);

    return new Response(JSON.stringify({ 
      response: completion.choices[0].message.content 
    }));

  } catch (error) {
    console.error('Copilot error:', error);
    return new Response(JSON.stringify({ 
      response: "I encountered an error while processing your request. Please try again."
    }));
  }
}

async function executeAction(action: string, actionData: any) {
  console.log(`🔄 executeAction called with:`, {
    action: action,
    actionData: actionData
  });
  
  try {
    let result;
    switch (action) {
      case 'GET_USERS':
        console.log('📡 Fetching all users');
        result = await copilotService.getUsers();
        break;
      case 'GET_USER':
        console.log(`📡 Fetching user by ID: ${actionData.id}`);
        result = await copilotService.getUserById(actionData.id);
        break;
      case 'CREATE_USER':
        console.log('📡 Creating new user:', actionData);
        result = await copilotService.createUser(actionData);
        break;
      case 'UPDATE_USER':
        console.log(`📡 Updating user ${actionData.id}:`, actionData);
        result = await copilotService.updateUser(actionData.id, actionData);
        break;
      case 'DELETE_USER':
        console.log(`📡 Deleting user: ${actionData.id}`);
        result = await copilotService.deleteUser(actionData.id);
        break;
      case 'GET_EMPLOYEES':
        console.log('📡 Fetching all employees');
        result = await copilotService.getEmployees();
        break;
      case 'ADD_EMPLOYEE':
        console.log('📡 Adding new employee:', actionData);
        result = await copilotService.addEmployee(actionData);
        break;
      case 'UPDATE_EMPLOYEE':
        console.log(`📡 Updating employee ${actionData.id}:`, actionData);
        result = await copilotService.updateEmployee(actionData.id, actionData);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    console.log(`✅ Action ${action} completed successfully:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Error executing ${action}:`, error);
    throw error;
  }
}

async function getRelevantContext(messages: any[], action?: string) {
  try {
    const context: any = {
      timestamp: new Date().toISOString(),
      action: action || 'chat',
    };

    // If the message is about employee/user count, always fetch the data
    if (messages.some(m => 
      m.content.toLowerCase().includes('how many') || 
      m.content.toLowerCase().includes('count') ||
      m.content.toLowerCase().includes('number of')
    )) {
      const users = await copilotService.getUsersByCompany();
      context.userCount = users.length;
    }

    return context;
  } catch (error) {
    console.error('Error getting context:', error);
    return {
      timestamp: new Date().toISOString(),
      action: action || 'chat',
      error: 'Failed to load some context data'
    };
  }
}

function validateEmployeeData(data: any): string[] {
  const missingFields = [];
  const requiredFields = {
    firstName: "first name",
    lastName: "last name",
    email: "email address",
    phoneNumber: "phone number",
    dateOfJoin: "start date",
    workerType: "worker type",
    jobTitle: "job title",
    companyLocationCategory: "location category",
    code: "state code"
  };

  for (const [field, label] of Object.entries(requiredFields)) {
    if (!data[field]) {
      missingFields.push(`- ${label}`);
    }
  }

  // Validate email format
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    missingFields.push("- valid email address (current format is invalid)");
  }

  // Validate phone number
  if (data.phoneNumber && !/^\d{10}$/.test(data.phoneNumber.replace(/\D/g, ''))) {
    missingFields.push("- valid 10-digit phone number");
  }

  // Validate date format
  if (data.dateOfJoin && !/^\d{4}-\d{2}-\d{2}$/.test(data.dateOfJoin)) {
    missingFields.push("- start date in YYYY-MM-DD format");
  }

  return missingFields;
}


