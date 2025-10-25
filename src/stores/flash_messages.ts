import { signal } from '@preact/signals-react';

export type FlashMessage = {
    text: string;
    type: 'success'|'error';
    classes?: string[];
}

export const flash_messages = signal<FlashMessage[]>([
    {text: '👋', type: 'success'},
]);

export function success(input: string) {
    const newMessages = Array.isArray(input)
        ? input.map((msg: string): FlashMessage => { return {text: msg, type: 'success'}; })
        : [{text: input, type: 'success'} as FlashMessage];

    flash_messages.value = [...newMessages, ...flash_messages.value];
}

export function error(input: string) {
    const newMessages = Array.isArray(input)
        ? input.map((msg: string): FlashMessage => { return {text: msg, type: 'error'}; })
        : [{text: input, type: 'error'} as FlashMessage];

    flash_messages.value = [...newMessages, ...flash_messages.value];
}
