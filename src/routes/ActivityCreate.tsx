import api_call from "../lib/api_call.ts";
import {useEffect, useState} from "react";
import ActivityType from "../lib/entities/ActivityType.ts";
import Errors from '../components/messages/Errors.tsx';
import Success from '../components/messages/Success.tsx';

export default function ActivityCreate() {
    const baseDate = (new Date()).toJSON().replace(/(:\d{2})?(\.\d+)?z$/i, '');

    let [errors, setErrors] = useState('');
    let [success, setSuccess] = useState('');

    let [description, setDescription] = useState('');
    let [date, setDate] = useState(baseDate);
    let [activityTypeId, setActivityTypeId] = useState('');
    let [activityTypes, setActivityTypes] = useState([]);

    async function create(formData: FormData): Promise<unknown> {
        console.info('submitting form');
        const data = {
            description: formData.get('description')?.toString(),
            date: formData.get('date') ? (formData.get('date') + ":00+0000") : null,
            activity_type_id: formData.get('activity_type_id') ? parseInt(formData.get('activity_type_id')?.toString()) : null,
        };
        try {
            setErrors('');
            setSuccess('');
            const result = await api_call('activity_create', data);
            console.info('success:', result);
            setSuccess('Done!');
            setDate(baseDate);
            setDescription('');
            setActivityTypeId('');
        } catch (e) {
            setErrors(e.toString());
        }
    }

    function fetchActivityTypes() {
        api_call("activity_type_list")
            .then((activity_types_input: Array<object>) => {
                const activity_types = activity_types_input.map((object) => ActivityType.from(object));
                console.info('activity types', activity_types);
                setActivityTypes(activity_types);
            })
            .catch(e => setErrors(e.messages));
    }

    useEffect(() => {
        fetchActivityTypes();
    }, []);

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
                            <td><label htmlFor="activity_type_id">Activity Type</label></td>
                            <td>
                                <select name="activity_type_id" value={activityTypeId} onChange={(e) => setActivityTypeId(e.target.value)}>
                                    <option value="">Select Activity Type (optional)</option>
                                    {activityTypes.map((activityType) => (
                                        <option key={activityType.id} value={activityType.id}>
                                            {activityType.name}
                                        </option>
                                    ))}
                                </select>
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
