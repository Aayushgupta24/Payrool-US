import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function App() {
  return (
    <html lang="en">
      <body>
        <CopilotKit 
          publicApiKey={import.meta.env.VITE_COPILOT_PUBLIC_API_KEY}
          runtimeUrl="/api/copilot"
        >
          <CopilotPopup
            labels={{
              title: "GrowthPods Assistant",
              initial: "How can I help you today?"
            }}
            instructions="I'm your GrowthPods AI assistant. How can I help you today?"
          />
        </CopilotKit>
      </body>
    </html>
  );
}
