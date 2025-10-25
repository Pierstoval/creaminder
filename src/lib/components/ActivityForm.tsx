import api_call from "../../lib/api_call.ts";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import ActivityType from "../../lib/entities/ActivityType.ts";
import { error } from '../../stores/flash_messages.ts';

export default function ActivityForm({onSubmit, data, type}) {
    const baseDate = (new Date()).toJSON().replace(/(:\d{2})?(\.\d+)?z$/i, '');
    const { t } = useTranslation();
    let [description, setDescription] = useState(data?.description);
    let [date, setDate] = useState(data?.date || baseDate);
    let [activityTypeId, setActivityTypeId] = useState(data?.activity_type_id);
    let [activityTypes, setActivityTypes] = useState([]);

    if (type !== 'create' && type !== 'update') {
        error(`Internal error: invalid type "${type}" when creating form. Set to "create" by default.`);
        type = 'create';
    }
    const message = type === 'create' ? 'button_create' : 'button_update';

    async function submit(formData: FormData): Promise<unknown> {
        await onSubmit({
            id: data?.id || undefined,
            description: formData.get('description')?.toString(),
            date: formData.get('date') ? (formData.get('date') + ":00+0000") : null,
            activity_type_id: formData.get('activity_type_id') ? parseInt(formData.get('activity_type_id')?.toString()) : null,
        });
    }

    function fetchActivityTypes() {
        api_call("activity_type_list")
            .then((activity_types_input: Array<object>) => {
                const activity_types = activity_types_input.map((object) => ActivityType.from(object));
                setActivityTypes(activity_types);
            })
            .catch(e => error(t('error_api_generic')+"\n"+e.toString()));
    }

    useEffect(() => {
        fetchActivityTypes();
    }, []);

    return (
        <form action={submit}>
            <table>
                <tbody>
                    <tr>
                        <td><label htmlFor="description">{t('field_description')}</label></td>
                        <td><input type="text" name="description" placeholder={t('field_description')} value={description} onChange={(e) => setDescription(e.target.value)} /></td>
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
                            <select name="activity_type_id" value={activityTypeId} onChange={(e) => setActivityTypeId(e.target.value)} required>
                                <option value="">- {t('activity_type_select')} -</option>
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
                        <td><button type="submit">{t(message)}</button></td>
                    </tr>
                </tbody>
            </table>
        </form>
    );
}
