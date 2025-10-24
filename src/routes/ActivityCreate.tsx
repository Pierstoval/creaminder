import api_call from "../lib/api_call.ts";
import {useState} from "react";
import Errors from '../components/messages/Errors.tsx';
import Success from '../components/messages/Success.tsx';

export default function ActivityCreate() {
    const baseDate = (new Date()).toJSON().replace(/(:\d{2})?(\.\d+)?z$/i, '');

    let [errors, setErrors] = useState('');
    let [success, setSuccess] = useState('');

    let [description, setDescription] = useState('');
    let [date, setDate] = useState(baseDate);

    async function create(formData: FormData): Promise<unknown> {
        console.info('submitting form');
        const data = {
            description: formData.get('description')?.toString(),
            date: formData.get('date') ? (formData.get('date') + ":00+0000") : null,
        };
        try {
            setErrors('');
            setSuccess('');
            const result = await api_call('activity_create', data);
            console.info('success:', result);
            setSuccess('Done!');
            setDate(baseDate);
            setDescription('');
        } catch (e) {
            setErrors(e.toString());
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
                            <td><input type="text" name="description" placeholder="Description" required value={description} onChange={(e) => setDescription(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="date">Date</label></td>
                            <td>
                                <input type="datetime-local" name="date" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><button type="submit">Submit</button></td>
                        </tr>
                    </tbody>
                </table>
                <Errors messages={errors} />
                <Success messages={success} />
            </form>
        </>
    );
}
