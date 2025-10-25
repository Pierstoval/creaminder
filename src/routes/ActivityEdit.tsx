 import api_call from "../lib/api_call.ts";
import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router";
import ActivityType from "../lib/entities/ActivityType.ts";
import Errors from '../components/messages/Errors.tsx';
import Success from '../components/messages/Success.tsx';
 import {useTranslation} from "react-i18next";

export default function ActivityEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    let [errors, setErrors] = useState('');
    let [success, setSuccess] = useState('');

    let [description, setDescription] = useState('');
    let [date, setDate] = useState('');
    let [activityTypeId, setActivityTypeId] = useState('');
    let [activityTypes, setActivityTypes] = useState([]);

    useEffect(() => {
        if (id) {
            // Fetch activity data and activity types in parallel
            Promise.all([
                api_call('activity_find_by_id', { id: parseInt(id) }),
                api_call('activity_type_list')
            ])
            .then(([activity, activity_types_input]) => {
                // Set activity types
                const activity_types = activity_types_input.map((object) => ActivityType.from(object));
                setActivityTypes(activity_types);

                // Set activity data
                setDescription(activity.description || '');
                // Convert date format for datetime-local input
                const activityDate = new Date(activity.date);
                const localDateTime = activityDate.toISOString().slice(0, 16);
                setDate(localDateTime);
                setActivityTypeId(activity.activity_type_id);
            })
            .catch((e) => {
                setErrors(t('error_api_generic')+"\n"+e.toString());
            });
        }
    }, [id]);

    async function update(formData: FormData): Promise<unknown> {
        const data = {
            id: parseInt(id!),
            description: formData.get('description')?.toString(),
            date: formData.get('date') ? (formData.get('date') + ":00+0000") : null,
            activity_type_id: formData.get('activity_type_id') ? parseInt(formData.get('activity_type_id')?.toString()) : null,
        };
        try {
            setErrors('');
            setSuccess('');
            await api_call('activity_update', data);
            navigate(`/activity/list`);
        } catch (e) {
            setErrors(t('error_api_generic')+"\n"+e.toString());
        }
    }

    return (
        <>
            <h2>{t('activity_edit')}</h2>

            <form action={update}>
                <table>
                    <tbody>
                        <tr>
                            <td><label htmlFor="description" required>{t('field_description')}</label></td>
                            <td><input type="text" name="description" placeholder={t('field_description')} required value={description} onChange={(e) => setDescription(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="date">{t('field_date')}</label></td>
                            <td>
                                <input type="datetime-local" name="date" placeholder={t('field_date')} value={date} onChange={(e) => setDate(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td><label htmlFor="activity_type_id" required>{t('activity_type_title')}</label></td>
                            <td>
                                <select name="activity_type_id" required value={activityTypeId} onChange={(e) => setActivityTypeId(e.target.value)}>
                                    <option value="">- {t('activity_type_select')}- </option>
                                    {activityTypes.map((activityType) => (
                                        <option key={activityType.id} value={activityType.id} selected={activityType.id == activityTypeId}>
                                            {activityType.name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button type="submit">{t('button_update')}</button>
                                <button type="button" onClick={() => navigate('/')}>{t('button_back')}</button>
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
