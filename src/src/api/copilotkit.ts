import { groqAdapter, copilotRuntime } from '../config/groqConfig';

export async function handler(req: Request) {
  try {
    const body = await req.json();
    const response = await copilotRuntime.processMessage(body, groqAdapter);
    
    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Copilot runtime error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
