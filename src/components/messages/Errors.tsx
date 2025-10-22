export default function Error({messages}) {
    if (!messages?.length) {
        return;
    }

    if (Array.isArray(messages)) {
        return (<div className="alert error"><ul className="nostyle">
            {messages.map(item => <li key={item} dangerouslySetInnerHTML={{__html: item}}></li>)}
        </ul></div>)
    }

    return (<div className="alert error">
        <div dangerouslySetInnerHTML={{__html: messages}}></div>
    </div>)
}
