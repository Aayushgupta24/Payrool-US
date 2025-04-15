import OpenAI from 'openai';
import { CopilotBackend } from "@copilotkit/backend";

export async function handler(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await req.json();
    const { messages } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-3.5-turbo" depending on your needs
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
    });

    return new Response(JSON.stringify({ 
      response: completion.choices[0].message.content 
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error("Copilot runtime error:", error);
    return new Response(JSON.stringify({ 
      error: "An error occurred while processing your request" 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
