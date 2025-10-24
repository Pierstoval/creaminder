import api_call from "../lib/api_call.ts";
import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router";
import Errors from '../components/messages/Errors.tsx';
import Success from '../components/messages/Success.tsx';

export default function ActivityTypeEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    let [errors, setErrors] = useState('');
    let [success, setSuccess] = useState('');
    let [loading, setLoading] = useState(true);

    let [name, setName] = useState('');
    let [description, setDescription] = useState('');

    useEffect(() => {
        if (id) {
            api_call('activity_type_find_by_id', { id: parseInt(id) })
                .then((activityType: any) => {
                    setName(activityType.name);
                    setDescription(activityType.description || '');
                    setLoading(false);
                })
                .catch((e) => {
                    setErrors(e.toString());
                    setLoading(false);
                });
        }
    }, [id]);

    async function update(formData: FormData): Promise<unknown> {
        console.info('submitting form');
        const data = {
            id: parseInt(id!),
            name: formData.get('name')?.toString(),
            description: formData.get('description')?.toString() || null,
        };
        try {
            setErrors('');
            setSuccess('');
            const result = await api_call('activity_type_update', data);
            console.info('success:', result);
            setSuccess('Activity type updated successfully!');
        } catch (e) {
            setErrors(e.toString());
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <h2>Edit Activity Type</h2>

            <form action={update}>
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
                            <td>
                                <button type="submit">Update</button>
                                <button type="button" onClick={() => navigate('/activity-type/list')}>Back</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Errors messages={errors} />
                <Success messages={success} />
            </form>
        </>
    );
}
