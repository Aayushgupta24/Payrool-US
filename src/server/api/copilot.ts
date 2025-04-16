import { SystemPrompt } from '@copilotkit/shared';
import { GroqClient } from '../../utils/groqClient';
import { copilotService } from '../../services/copilotService';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

const groqClient = new GroqClient(process.env.GROQ_API_KEY);

const hiringSystemPrompt = `You are a helpful Payroll AI Agent that assists with adding new employees. Follow these steps precisely:

1. When a user wants to add an employee, gather information ONE field at a time in this order:

   First ask: "What is the employee's first name?"
   After getting first name, ask: "What is {firstName}'s last name?"
   After last name, ask: "What is {firstName}'s email address?"
   After email, ask: "What is {firstName}'s phone number? (10 digits)"
   After phone, ask: "What is {firstName}'s start date? (YYYY-MM-DD)"
   After date, ask: "Is {firstName} a W2 employee or 1099 contractor?"
   After worker type, ask: "What is {firstName}'s job title?"
   After job title, ask: "Will {firstName} be Remote or On-site?"
   Finally, ask: "What state will {firstName} be working from? (2-letter code)"

2. After collecting ALL information, show a preview:

   📋 Employee Details Preview:
   - First Name: {firstName}
   - Last Name: {lastName}
   - Email: {email}
   - Phone: {phone}
   - Start Date: {startDate}
   - Worker Type: {workerType}
   - Job Title: {jobTitle}
   - Location: {locationType}
   - State: {stateCode}

   Ask: "Would you like me to add this employee to the system? (yes/no)"

3. Validation Rules:
   - Phone must be exactly 10 digits
   - Email must be valid format
   - Date must be YYYY-MM-DD
   - Worker Type must be W2 or 1099
   - Location must be Remote or On-site
   - State must be 2-letter code

4. If any validation fails:
   - Explain the error clearly
   - Ask for the correct information
   - Do not proceed until fixed

Example conversation:
User: "I need to add a new employee"
Assistant: "I'll help you add a new employee. What is the employee's first name?"
User: "John"
Assistant: "What is John's last name?"
[continue with each field]

Never ask for multiple pieces of information at once. Collect one field at a time.`;

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

    // Validate data before processing
    if (lastMessage.toLowerCase().includes('add') && lastMessage.toLowerCase().includes('employee')) {
      // Extract phone number using regex
      const phoneMatch = lastMessage.match(/\b\d{10}\b|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);
      const phoneNumber = phoneMatch ? phoneMatch[0].replace(/[-\.]/g, '') : '';

      if (!phoneNumber || phoneNumber.length !== 10) {
        return new Response(JSON.stringify({ 
          response: "⚠️ Error: Please provide a valid 10-digit phone number. For example: 1234567890"
        }));
      }

      // Validate email
      const emailMatch = lastMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (!emailMatch) {
        return new Response(JSON.stringify({ 
          response: "⚠️ Error: Please provide a valid email address. For example: name@company.com"
        }));
      }

      // Continue with the rest of the validation from validateEmployeeData
      const data = extractEmployeeData(lastMessage);
      const missingFields = validateEmployeeData(data);
      
      if (missingFields.length > 0) {
        return new Response(JSON.stringify({ 
          response: `⚠️ Error: The following information is missing or invalid:\n${missingFields.join('\n')}\n\nPlease provide all required information.`
        }));
      }
    }

    // Default response using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        ...messages,
        { role: 'system', content: `Current context:
Route: ${context.route}
Company: ${context.company?.company || 'None selected'}
Employees: ${context.employeeData?.employees.length || 0}
Contractors: ${context.employeeData?.contractors.length || 0}

Please handle any errors gracefully and provide clear error messages to the user.`
        }
      ]
    });

    return new Response(JSON.stringify({ 
      response: completion.choices[0].message.content 
    }));

  } catch (error) {
    console.error('Copilot error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ 
      response: `⚠️ Error: ${errorMessage}\n\nPlease try again with valid information.`
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
  
  // Validate each field one at a time
  if (!data.firstName) {
    return ["Please provide the employee's first name"];
  }
  if (!data.lastName) {
    return ["Please provide the employee's last name"];
  }
  if (!data.email) {
    return ["Please provide the employee's email address"];
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return ["Please provide a valid email address"];
  }
  if (!data.phoneNumber || !/^\d{10}$/.test(data.phoneNumber.replace(/\D/g, ''))) {
    return ["Please provide a valid 10-digit phone number"];
  }
  if (!data.dateOfJoin || !/^\d{4}-\d{2}-\d{2}$/.test(data.dateOfJoin)) {
    return ["Please provide a valid start date in YYYY-MM-DD format"];
  }
  if (!data.workerType || !['W2', '1099'].includes(data.workerType.toUpperCase())) {
    return ["Please specify if the employee is W2 or 1099"];
  }
  if (!data.jobTitle) {
    return ["Please provide the employee's job title"];
  }
  if (!data.companyLocationCategory || !['Remote', 'On-site'].includes(data.companyLocationCategory)) {
    return ["Please specify if the employee is Remote or On-site"];
  }
  if (!data.code || !/^[A-Z]{2}$/.test(data.code.toUpperCase())) {
    return ["Please provide a valid 2-letter state code"];
  }

  return missingFields;
}


