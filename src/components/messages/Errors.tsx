import Alert from "./Alert";

export default function Error({messages}) {
    return (<Alert addClass="error" messages={messages} />);
}
