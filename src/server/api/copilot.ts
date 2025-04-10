import { SystemPrompt } from '@copilotkit/shared';
import { GroqClient } from '../../utils/groqClient';
import { copilotService } from '../../services/copilotService';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

const groqClient = new GroqClient(process.env.GROQ_API_KEY);

const systemPrompt: SystemPrompt = {
  content: `You are a helpful assistant for the GrowthPods platform. When handling employee creation:

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

  2. After collecting information, confirm with the user and use CREATE_USER action.

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

  4. If any information is missing or invalid, ask for it specifically.`,
  role: 'system'
};

export async function POST(req: Request) {
  console.log('🚀 Copilot API Request received:', {
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
    url: req.url
  });

  try {
    const body = await req.json();
    console.log('📥 Request body:', JSON.stringify(body, null, 2));

    const { messages, action, actionData, stream = true } = body;

    // Check message intent
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    console.log('🔍 Processing last message:', lastMessage);

    let detectedAction = null;
    let contextData = {};

    // Detect count-related questions
    if (lastMessage.includes('how many') && 
        (lastMessage.includes('user') || lastMessage.includes('employee') || 
         lastMessage.includes('people') || lastMessage.includes('staff'))) {
      console.log('📊 Detected count query, fetching user count...');
      try {
        console.log('📡 Calling getUsersByCompany API...');
        const users = await copilotService.getUsersByCompany();
        console.log(`✅ Retrieved ${users.length} users`);
        
        contextData = { userCount: users.length };
        console.log('📤 Sending count response');
        return new Response(JSON.stringify({ 
          response: `Based on the current data, your company has ${users.length} users/employees.`
        }));
      } catch (error) {
        console.error('❌ Error fetching user count:', error);
        return new Response(JSON.stringify({ 
          response: "Failed to fetch user count. Please try again or contact support."
        }));
      }
    }

    // Detect create/update actions
    if (lastMessage.includes('create') || lastMessage.includes('add') || 
        lastMessage.includes('new')) {
      detectedAction = 'CREATE_USER';
      console.log('🆕 Detected create action');
    } else if (lastMessage.includes('update') || lastMessage.includes('change') || 
               lastMessage.includes('modify')) {
      detectedAction = 'UPDATE_USER';
      console.log('📝 Detected update action');
    }

    // If action detected, execute it
    if (detectedAction) {
      console.log(`🎯 Executing action: ${detectedAction}`, {
        actionData: actionData
      });
      try {
        const result = await executeAction(detectedAction, actionData);
        console.log('✅ Action executed successfully:', result);
        contextData = { actionResult: result };
      } catch (error) {
        console.error(`❌ Error executing ${detectedAction}:`, error);
        return new Response(JSON.stringify({ 
          response: `Failed to ${detectedAction.toLowerCase()}: ${error.message}`
        }));
      }
    }

    // Enhance the message processing to handle employee creation flow
    if (lastMessage.includes('add') && 
        (lastMessage.includes('employee') || lastMessage.includes('worker'))) {
      
      // If no actionData provided, start collection flow
      if (!actionData) {
        return new Response(JSON.stringify({
          response: `I'll help you add a new employee. Please provide the following information:
          1. Employee's first and last name
          2. Email address
          3. Phone number
          4. Start date (YYYY-MM-DD)
          5. Worker type (W2 or 1099)
          6. Job title
          7. Location (Remote or On-site)
          8. State code

          Please provide the employee's first and last name to begin.`
        }));
      }

      // If actionData is partial, ask for missing fields
      const missingFields = validateEmployeeData(actionData);
      if (missingFields.length > 0) {
        return new Response(JSON.stringify({
          response: `Please provide the following missing information:
          ${missingFields.join('\n')}`
        }));
      }

      // If all data is present, proceed with creation
      try {
        const result = await copilotService.createUser(actionData);
        return new Response(JSON.stringify({
          response: `Successfully added employee ${actionData.firstName} ${actionData.lastName} as ${actionData.jobTitle}.`
        }));
      } catch (error) {
        return new Response(JSON.stringify({
          response: `Failed to add employee: ${error.message}`
        }));
      }
    }

    // Regular chat flow with context
    const augmentedMessages = [
      systemPrompt,
      {
        role: 'system',
        content: `Current context:\n${JSON.stringify(contextData, null, 2)}`,
      },
      ...messages,
    ];

    console.log('📤 Sending request to Groq:', {
      messageCount: augmentedMessages.length,
      contextData: contextData,
      streaming: stream
    });

    if (stream) {
      console.log('🌊 Initiating streaming response');
      const stream = await groqClient.createStreamingCompletion(augmentedMessages);
      console.log('✅ Stream established');
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      console.log('📩 Requesting completion from Groq');
      const completion = await groqClient.createCompletion(augmentedMessages);
      console.log('✅ Received completion:', completion.choices[0].message);
      return new Response(JSON.stringify({ 
        response: completion.choices[0].message.content 
      }));
    }
  } catch (error) {
    console.error('❌ Fatal error processing request:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { status: 500 });
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







