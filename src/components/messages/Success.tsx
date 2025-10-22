export default function Success({messages}) {
    if (!messages?.length) {
        return;
    }

    if (Array.isArray(messages)) {
        return (<div className="alert success"><ul className="nostyle">
            {messages.map(item => <li key={item} dangerouslySetInnerHTML={{__html: item}}></li>)}
        </ul></div>)
    }

    return (<div className="alert success">
        <div dangerouslySetInnerHTML={{__html: messages}}></div>
    </div>)
}
