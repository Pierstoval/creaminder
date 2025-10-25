import {useEffect, useState} from "react";

export default function Alert({messages, addClass}) {
    const [messageDisplay, setMessageDisplay] = useState('');
    const [closeTimeout, setCloseTimeout] = useState(0);

    useEffect(() => {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            setCloseTimeout(0);
        }
        if (!messages.length) {
            return;
        }
        setMessageDisplay(messages);
        setCloseTimeout(setTimeout(() => {
            setMessageDisplay('');
        }, 3000));
    }, [messages]);

    if (!messageDisplay?.length) {
        return;
    }

    const className = `alert ${addClass}`;

    if (Array.isArray(messageDisplay)) {
        return (<div className={className}><ul className="nostyle">
            {messageDisplay.map(item => <li key={item} dangerouslySetInnerHTML={{__html: item}}></li>)}
        </ul></div>)
    }

    return (<div className={className}>
        <div dangerouslySetInnerHTML={{__html: messageDisplay}}></div>
    </div>)
}
