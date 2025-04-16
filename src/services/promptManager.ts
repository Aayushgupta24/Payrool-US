export interface PromptContext {
  currentPage: string;
  userRole?: string;
  availableActions?: string[];
  userData?: any;
  companyData?: any;
}

export class PromptManager {
  private static basePrompt = `You are a helpful Payroll AI Agent that assists with managing employees, payroll, and company operations. 
You should be friendly, professional, and always provide clear, step-by-step guidance.`;

  private static hiringPrompt = `When collecting information for a new user, always:

1. Collect information in this specific order:
   - First Name
   - Last Name
   - Email
   - Phone Number (10 digits)
   - Start Date (YYYY-MM-DD)
   - Worker Type (W2 or 1099)
   - Job Title
   - Work Location (Remote or On-site)
   - State Code (REQUIRED two-letter code)

2. For State Code:
   - Always ask "Which state will they be working from? (Please provide the two-letter state code)"
   - Must be a valid US state code (e.g., FL, NY, CA)
   - Don't proceed without a valid state code
   - If invalid, provide examples: "Please provide a valid two-letter state code. Examples: FL (Florida), NY (New York), CA (California)"

3. Before final submission:
   - Show all collected information
   - Confirm all required fields are filled
   - Ask for confirmation before adding

4. After successful addition:
   - Confirm success
   - Offer next actions (add another, view all, etc.)
   - Handle any errors clearly`;

  private static getPageSpecificPrompt(page: string): string {
    const prompts: Record<string, string> = {
      '/users': `
I'm here to help you manage your team members! 👥

I can assist you with:
🆕 Adding new team members:
  - "Add a new employee (W2)"
  - "Add a contractor (1099)"
  - "Help me hire someone"

🔍 Finding people:
  - "Find someone by email"
  - "Search for [name]"
  - "Show me all contractors"

✏️ Updates and changes:
  - "Update someone's information"
  - "Change an employee's role"
  - "Update contact details"

❌ Deactivations:
  - "Help me deactivate a user"
  - "Process an employee exit"

📊 Quick stats:
  - "How many employees do we have?"
  - "Show contractor count"
  - "Active employee summary"`,

      '/hiring': `
Welcome to the hiring section! 🎉

I can help you with:
📝 New Hire Processing:
  - Adding W2 employees
  - Setting up contractors (1099)
  - Collecting required documents

📋 Documentation:
  - "What documents do I need?"
  - "Help with I-9 verification"
  - "Tax form requirements"

💼 Onboarding Steps:
  - "Start onboarding process"
  - "Setup payroll information"
  - "Benefits enrollment help"

Just let me know what you need help with!`,

      '/payroll': `
Let's manage your payroll! 💰

I can help you with:
💵 Payroll Processing:
  - "Run payroll for employees"
  - "Process contractor payments"
  - "Schedule next payroll"

📅 Payment Schedules:
  - "View payment calendar"
  - "Change payment frequency"
  - "Update direct deposit"

🧮 Tax Management:
  - "Calculate tax withholdings"
  - "Generate tax reports"
  - "Update tax information"

📊 Reports:
  - "Run payroll report"
  - "Show payment history"
  - "Generate tax summaries"`,

      '/dashboard': `
Welcome to your dashboard! 🎯

I can help you with:
📊 Quick Actions:
  - "Show company metrics"
  - "View recent activities"
  - "Generate quick reports"

💡 Common Tasks:
  - "Start new payroll"
  - "Add new employee"
  - "View team summary"

🔄 Navigation:
  - "Go to payroll"
  - "Switch to team view"
  - "Open reports section"`,

      '/team': `
Welcome to team management! 👥

I can help you with:
👥 Team Overview:
  - "Show all team members"
  - "Filter by department"
  - "View org chart"

📋 Team Actions:
  - "Update team structure"
  - "Manage reporting lines"
  - "Team member details"

🔄 Status Updates:
  - "Change employee status"
  - "Update work location"
  - "Modify team assignments"`,

      '/company': `
Welcome to company settings! ⚙️

I can help you with:
🏢 Company Information:
  - "Update company details"
  - "Manage locations"
  - "Edit tax information"

📝 Policy Management:
  - "Update company policies"
  - "Manage benefits"
  - "Edit time off settings"

🔐 Access Control:
  - "Manage permissions"
  - "Update role access"
  - "Security settings"`
    };
    return prompts[page] || '';
  }

  private static getActionPrompt(actions: string[]): string {
    if (!actions.length) return '';
    return `\n\nAvailable quick actions:\n${actions.map(action => `• ${action}`).join('\n')}`;
  }

  private static getUserContextPrompt(userData: any): string {
    if (!userData) return '';
    return `\n\nCurrent user context:
• Role: ${userData.role}
• Permissions: ${userData.permissions?.join(', ')}`;
  }

  private static getCompanyContextPrompt(companyData: any): string {
    if (!companyData) return '';
    return `\n\nCompany context:
• Name: ${companyData.name}
• Type: ${companyData.type}
• Team size: ${companyData.employeeCount} members`;
  }

  static generatePrompt(context: PromptContext): string {
    const parts = [
      this.basePrompt,
      this.getPageSpecificPrompt(context.currentPage),
      context.availableActions ? this.getActionPrompt(context.availableActions) : '',
      context.userData ? this.getUserContextPrompt(context.userData) : '',
      context.companyData ? this.getCompanyContextPrompt(context.companyData) : ''
    ];

    return parts.filter(Boolean).join('\n');
  }
}


