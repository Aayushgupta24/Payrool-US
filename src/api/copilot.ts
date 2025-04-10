import { CopilotBackend } from "@copilotkit/backend";

export async function handler(req: Request) {
  try {
    const copilotBackend = new CopilotBackend({
      apiKey: process.env.COPILOT_API_KEY,
    });

    const body = await req.json();
    const response = await copilotBackend.processMessage(body);
    
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
