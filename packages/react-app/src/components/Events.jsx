import { List } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
import Address from "./Address";

/**
  ~ What it does? ~

  Displays a lists of events

  ~ How can I use? ~

  <Events
    contracts={readContracts}
    contractName="YourContract"
    eventName="SetPurpose"
    localProvider={localProvider}
    mainnetProvider={mainnetProvider}
    startBlock={1}
  />
**/

export default function Events({ question }) {
  // 📟 Listen for broadcast events
  const events = useEventListener(question);

  return (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <h2>Questions:</h2>
      <List
        bordered
        dataSource={events}
        renderItem={item => {
          return <List.Item key={item.args.question}>{item.args[1]}</List.Item>;
        }}
      />
    </div>
  );
}
