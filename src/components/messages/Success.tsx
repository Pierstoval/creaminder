import Alert from "./Alert";

export default function Success({messages}) {
    return (<Alert addClass="success" messages={messages} />);
}
