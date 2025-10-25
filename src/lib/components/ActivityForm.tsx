import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import ActivityType, {getActivityTypesList} from "../../lib/entities/ActivityType.ts";
import { error } from '../../stores/flash_messages.ts';
import Activity from "../entities/Activity.ts";

interface Props {
    onSubmit: (activity: Activity) => Promise<void>;
    type: 'create' | 'update';
    data?: Activity;  // Optional prop
}

export default function ActivityForm({onSubmit, type, data}: Props) {
    const baseDate = (new Date()).toJSON().replace(/(:\d{2})?(\.\d+)?z$/i, '');
    const { t } = useTranslation();
    let [description, setDescription] = useState(data?.description);
    let [date, setDate] = useState(data?.date || baseDate);
    let [activityTypeId, setActivityTypeId] = useState(data?.activity_type_id);
    let [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);

    if (type !== 'create' && type !== 'update') {
        error(`Internal error: invalid type "${type}" when creating form. Set to "create" by default.`);
        type = 'create';
    }
    const message = type === 'create' ? 'button_create' : 'button_update';

    async function submit(formData: FormData): Promise<void> {
        await onSubmit(Activity.from({
            id: data?.id || undefined,
            description: formData.get('description')?.toString(),
            date: formData.get('date') ? (formData.get('date') + ":00+0000") : null,
            activity_type_id: formData.get('activity_type_id') ? Number(formData.get('activity_type_id')) : null,
        }));
    }

    useEffect(() => {
        getActivityTypesList().then(list => setActivityTypes(list)).catch(e => error(e.toString()));
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
                            <input type="datetime-local" name="date" placeholder={t('field_date')} value={date?.toString()} onChange={(e) => setDate(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td><label htmlFor="activity_type_id" className="required">{t('activity_type_title')}</label></td>
                        <td>
                            <select name="activity_type_id" value={activityTypeId?.toString()} onChange={(e) => setActivityTypeId(Number(e.target.value))} required>
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
