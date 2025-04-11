import { CopilotBackend } from "@copilotkit/backend";

export async function handler(req: Request) {
  try {
    const copilotBackend = new CopilotBackend({
      apiKey: process.env.COPILOT_API_KEY,
    });

    const body = await req.json();
    const { message } = body;

    // Process switch view commands
    if (message.toLowerCase().includes('switch') || 
        message.toLowerCase().includes('change') || 
        message.toLowerCase().includes('go to')) {
      
      let viewType = 'employer'; // default
      
      if (message.toLowerCase().includes('employee')) {
        viewType = 'employee';
      } else if (message.toLowerCase().includes('admin')) {
        viewType = 'admin';
      }

      return await copilotBackend.executeAction('switchView', { viewType });
    }

    // Process navigation commands
    if (message.toLowerCase().includes('go to') || message.toLowerCase().includes('take me to')) {
      const page = extractPageFromMessage(message);
      return await copilotBackend.executeAction('navigateToPage', { page });
    }

    // Process add user commands
    if (message.toLowerCase().includes('add') && 
       (message.toLowerCase().includes('employee') || message.toLowerCase().includes('contractor'))) {
      const userType = message.toLowerCase().includes('contractor') ? 'contractor' : 'employee';
      return await copilotBackend.executeAction('addNewUser', { userType });
    }

    // Process dashboard switch commands
    if (message.toLowerCase().includes('switch') && message.toLowerCase().includes('dashboard')) {
      const type = message.toLowerCase().includes('employee') ? 'employee' : 'employer';
      return await copilotBackend.executeAction('switchDashboard', { type });
    }

    // Process search commands
    if (message.toLowerCase().includes('search') || message.toLowerCase().includes('find')) {
      const searchTerm = extractSearchTerm(message);
      return await copilotBackend.executeAction('searchUsers', { searchTerm });
    }

    // Default processing
    return await copilotBackend.processMessage(body);
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

function extractPageFromMessage(message: string): string {
  const pages = ['users', 'team', 'hiring', 'dashboard', 'company'];
  return pages.find(page => message.toLowerCase().includes(page)) || 'dashboard';
}

function extractSearchTerm(message: string): string {
  const searchTerms = message.toLowerCase().split(/search for|find|look for/);
  return searchTerms[1]?.trim() || '';
}


