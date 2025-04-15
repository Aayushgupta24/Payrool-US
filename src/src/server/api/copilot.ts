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
   - Email (must be valid email format)
   - Phone Number (must be exactly 10 digits)
   - Date of Join (must be YYYY-MM-DD format)
   - Worker Type (W2 or 1099)
   - Job Title
   - Location Category (Remote or On-site)
   - State Code (e.g., FL, CA)

2. After collecting information, validate ALL fields before attempting to add the user:
   - Phone number must be exactly 10 digits
   - Email must be in valid format
   - Date must be in YYYY-MM-DD format
   - All required fields must be present

3. If validation fails:
   - Clearly explain which fields are invalid
   - Ask the user to provide the correct information
   - Do NOT proceed with user creation until all validations pass

4. Only report success if the user was actually added to the system
   - Wait for confirmation from the system
   - Check for error responses
   - Report any errors back to the user

Example error handling:
User: "Add John Doe with phone 123"
Assistant: "❌ Error: Please provide a valid 10-digit phone number for John Doe. The current number '123' is invalid."`;

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


