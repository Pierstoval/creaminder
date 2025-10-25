import {useEffect, useState} from "react";
import {flash_messages, FlashMessage} from "../../../stores/flash_messages.ts";

export default function FlashMessages() {
    const [internalMessages, setInternalMessages] = useState<FlashMessage[]>([]);

    useEffect(() => {
        flash_messages.subscribe(newMessages => setInternalMessages(newMessages));
    }, []);

    function close(message: FlashMessage, timeout: number = 1000) {
        flash_messages.value = flash_messages.value.map(m => {
            if (m == message) {
                m.classes = [...(m.classes||[]), 'closing'];
            }
            return m;
        });
        setTimeout(() => deleteMessage(message), timeout);
    }

    function deleteMessage(message: FlashMessage) {
        flash_messages.value = flash_messages.value.filter(m => m != message);
    }

    if (!internalMessages?.length) {
        return;
    }

    return (<div className="alerts">
        {internalMessages.map((message, index) => {
            const className = `alert ${message.type} ${(message.classes||[]).join(' ')}`;
            setTimeout(() => close(message), 5000);
            return (<div className={className} key={index}>
                <div dangerouslySetInnerHTML={{__html: message.text}}></div>
                <span className="close" onClick={() => close(message, 0)}>&times;</span>
            </div>)
        })}
    </div>);
}
