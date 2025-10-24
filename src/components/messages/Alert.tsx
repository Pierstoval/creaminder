import {useEffect, useState} from "react";

export default function Alert({messages, addClass}) {
    const [messageDisplay, setMessageDisplay] = useState('');
    const [closeTimeout, setCloseTimeout] = useState(0);
    console.info('mounting alert', {messages, addClass});

    useEffect(() => {
        console.info('setting message', {closeTimeout, messages});
        if (closeTimeout) {
            console.info('clearing timeout');
            clearTimeout(closeTimeout);
            setCloseTimeout(0);
        }
        if (!messages.length) {
            console.info('no message');
            return;
        }
        setMessageDisplay(messages);
        console.info('setting timeout');
        setCloseTimeout(setTimeout(() => {
            console.info('timeout called');
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
