import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function App() {
  return (
    <html lang="en">
      <body>
        <CopilotKit publicApiKey="ck_pub_ec1e7bce3f8cfdd4b6afff6e4a7a6878">
          <CopilotPopup
            labels={{
              title: "Popup Assistant",
              initial: "How can I help you today?"
            }}
            instructions="AI help that shows up right when you need it"
          />
        </CopilotKit>
      </body>
    </html>
  );
}
