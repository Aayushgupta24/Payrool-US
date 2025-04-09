import { SystemPrompt } from '@copilotkit/shared';
import { GroqClient } from '../../utils/groqClient';
import { copilotService } from '../../services/copilotService';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

const groqClient = new GroqClient(process.env.GROQ_API_KEY);

const systemPrompt: SystemPrompt = {
  content: `You are a helpful assistant for the GrowthPods platform. You have direct access to company data through these operations:

  Available Operations:
  - getUsersByCompany(): Gets all users/employees in the current company
  - getUserCount(): Gets the total count of users in the company
  - addEmployee(employeeData): Adds a new employee
  - getPayroll(): Gets payroll information
  - runPayroll(payrollData): Runs payroll

  When asked about employee or user counts:
  1. Use getUsersByCompany() or getUserCount() to fetch the actual data
  2. Provide the specific number in your response
  3. Never say you don't have access - you do have access through the API

  Example response for employee count:
  "Based on the current data, your company has [X] employees."

  If an API error occurs, respond with:
  "I encountered an error while fetching the employee count. Please try again or check with your system administrator."`,
  role: 'system'
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, action, actionData, stream = true } = body;

    // Check if the message is asking about employee count
    const isEmployeeCountQuestion = messages.some(m => 
      m.content.toLowerCase().includes('how many') && 
      (m.content.toLowerCase().includes('employee') || 
       m.content.toLowerCase().includes('people'))
    );

    let contextData = {};
    
    // If asking about employee count, fetch the data first
    if (isEmployeeCountQuestion) {
      try {
        const users = await copilotService.getUsersByCompany();
        contextData = { userCount: users.length };
        
        // Provide direct answer about employee count
        const response = `Based on the current data, your company has ${users.length} employees.`;
        return new Response(JSON.stringify({ response }));
      } catch (error) {
        console.error('Error fetching employee count:', error);
        return new Response(JSON.stringify({ 
          response: "I encountered an error while fetching the employee count. Please try again or check with your system administrator."
        }));
      }
    }

    // Regular chat flow continues here...
    const augmentedMessages = [
      systemPrompt,
      {
        role: 'system',
        content: `Current context:\n${JSON.stringify(contextData, null, 2)}`,
      },
      ...messages,
    ];

    if (stream) {
      const stream = await groqClient.createStreamingCompletion(augmentedMessages);
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      const completion = await groqClient.createCompletion(augmentedMessages);
      const response = completion.choices[0].message.content;
      return new Response(JSON.stringify({ response }));
    }
  } catch (error: any) {
    console.error('Copilot API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500 });
  }
}

async function executeAction(action: string, actionData: any) {
  try {
    switch (action) {
      case 'GET_USERS':
        return await copilotService.getUsers();
      case 'GET_USER':
        return await copilotService.getUserById(actionData.id);
      case 'CREATE_USER':
        return await copilotService.createUser(actionData);
      case 'UPDATE_USER':
        return await copilotService.updateUser(actionData.id, actionData);
      case 'DELETE_USER':
        return await copilotService.deleteUser(actionData.id);
      case 'GET_EMPLOYEES':
        return await copilotService.getEmployees();
      case 'ADD_EMPLOYEE':
        return await copilotService.addEmployee(actionData);
      case 'UPDATE_EMPLOYEE':
        return await copilotService.updateEmployee(actionData.id, actionData);
      case 'GET_DOCUMENTS':
        return await copilotService.getDocuments();
      case 'GET_PAYROLL':
        return await copilotService.getPayroll();
      case 'RUN_PAYROLL':
        return await copilotService.runPayroll(actionData);
      case 'GET_USER_COUNT':
        const users = await copilotService.getUsersByCompany();
        return { count: users.length };
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error(`Error executing action ${action}:`, error);
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




