import api_call from "../lib/api_call.ts";
import {useState} from "react";
import Errors from '../components/messages/Errors.tsx';
import Success from '../components/messages/Success.tsx';

export default function ActivityTypeCreate() {
    let [errors, setErrors] = useState('');
    let [success, setSuccess] = useState('');

    let [name, setName] = useState('');
    let [description, setDescription] = useState('');

    async function create(formData: FormData): Promise<unknown> {
        console.info('submitting form');
        const data = {
            name: formData.get('name')?.toString(),
            description: formData.get('description')?.toString() || null,
        };
        try {
            setErrors('');
            setSuccess('');
            const result = await api_call('activity_type_create', data);
            console.info('success:', result);
            setSuccess('Activity type created successfully!');
            setName('');
            setDescription('');
        } catch (e) {
            setErrors(e.toString());
        }
    }

    return (
        <>
            <h2>Create new activity type</h2>

            <form action={create}>
                <table>
                    <tbody>
                        <tr>
                            <td><label htmlFor="name" required>Name</label></td>
                            <td><input type="text" name="name" placeholder="Activity Type Name" required value={name} onChange={(e) => setName(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="description">Description</label></td>
                            <td>
                                <textarea name="description" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
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