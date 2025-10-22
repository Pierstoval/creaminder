import api_call from "../lib/api_call.ts";
import {useEffect, useState} from "react";
import Errors from '../components/messages/Errors.tsx';
import Success from '../components/messages/Success.tsx';

export default function ActivityCreate() {
    let [errors, setErrors] = useState('');
    let [success, setSuccess] = useState('');
    let [pending, setPending] = useState(false);

    async function create(formData: FormData): Promise<unknown> {
        if (pending) {
            return;
        }
        setPending(true);
        const data = {
            description: formData.get('description')?.toString(),
            date: formData.get('date') ? (formData.get('date') + ":00+0000") : null,
        };
        try {
            const result = await api_call('activity_create', data);
            console.info('success:', result);
            setSuccess('Done!');
        } catch (e) {
            setErrors(e.toString());
        } finally {
            setPending(false);
        }
    }

    return (
        <>
            <h2>Create new activity</h2>

            <form action={create}>
                <table>
                    <tbody>
                        <tr>
                            <td><label htmlFor="description" required>Description</label></td>
                            <td><input type="text" name="description" placeholder="Description" required /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="date">Date</label></td>
                            <td>
                                <input type="datetime-local" name="date" placeholder="Date" defaultValue={(new Date()).toJSON().replace(/(:\d{2})?(\.\d+)?z$/i, '')} />
                            </td>
                        </tr>
                        <tr>
                            <td>{pending ? 'pending' : 'not pending'}</td>
                            <td><button type="submit" disabled={pending}>Submit</button></td>
                        </tr>
                    </tbody>
                </table>
                <Errors messages={errors} />
                <Success messages={success} />
            </form>
        </>
    );
}
