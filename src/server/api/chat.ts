import { ChatCompletionCreateParams } from 'openai/resources/chat';
import { SystemPrompt } from '@copilotkit/shared';

export const systemPrompt: SystemPrompt = {
  content: `You are a helpful assistant for the GrowthPods platform. 
  You can help users with:
  - Managing employees and contractors
  - Handling payroll and benefits
  - Accessing tax documents
  - Understanding company policies
  - Generating reports
  
  Use the available context to provide accurate responses.`,
  role: 'system',
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionCreateParams.Message[] = body.messages;

    // Add your business logic to fetch relevant context
    const context = await getRelevantContext(messages);

    const augmentedMessages = [
      systemPrompt,
      {
        role: 'system',
        content: `Current context:\n${context}`,
      },
      ...messages,
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: augmentedMessages,
        temperature: 0.7,
      }),
    });

    return new Response(response.body, {
      headers: response.headers,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

async function getRelevantContext(messages: ChatCompletionCreateParams.Message[]) {
  // Implement your context fetching logic here
  // Example:
  const lastMessage = messages[messages.length - 1];
  let context = '';

  if (lastMessage.content.toLowerCase().includes('payroll')) {
    const payrollData = await fetchPayrollData();
    context += `\nPayroll Information:\n${JSON.stringify(payrollData)}`;
  }

  if (lastMessage.content.toLowerCase().includes('employees')) {
    const employeeData = await fetchEmployeeData();
    context += `\nEmployee Information:\n${JSON.stringify(employeeData)}`;
  }

  return context;
}

// Mock data fetching functions
async function fetchPayrollData() {
  return {
    nextPayrollDate: '2024-03-15',
    payrollFrequency: 'Bi-weekly',
    lastProcessedDate: '2024-03-01',
  };
}

async function fetchEmployeeData() {
  return {
    totalEmployees: 25,
    activeEmployees: 23,
    contractors: 5,
  };
}