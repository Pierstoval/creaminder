import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import ActivityType, {getActivityTypesList} from "../../lib/entities/ActivityType.ts";
import {error} from '../../stores/flash_messages.ts';
import {Activity, PartialActivity} from "../entities/Activity.ts";
import DatePicker from "react-datepicker";
import {getFormattedTimezoneOffset} from "../utils.ts";

interface Props {
    onSubmit: (activity: PartialActivity) => Promise<void>;
    type: 'create' | 'update';
    data?: Partial<Activity>;  // Optional prop
}

export default function ActivityForm({onSubmit, type, data}: Props) {
    const {t, i18n} = useTranslation();
    let [description, setDescription] = useState<undefined | string>(data?.description);
    let [date, setDate] = useState<null | Date>(data?.date ? new Date(data.date) : null);
    let [activityTypeId, setActivityTypeId] = useState<null | number>(data?.activity_type_id || null);
    let [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);

    if (type !== 'create' && type !== 'update') {
        error(`Internal error: invalid type "${type}" when creating form. Set to "create" by default.`);
        type = 'create';
    }
    const message = type === 'create' ? 'button_create' : 'button_update';

    async function submit(): Promise<void> {
        let newDate = null;
        if (date) {
            const offsetString = getFormattedTimezoneOffset(new Date().getTimezoneOffset());
            newDate = date.toJSON().replace(/(\.\d+)?z/i, '') + offsetString;
        }
        const submitData = {
            id: Number(data?.id || 0),
            description: description?.toString() || null,
            date: newDate,
            activity_type_id: activityTypeId || null,
        };
        if (!submitData.activity_type_id) {
            error(t('activity_form_type_mandatory'));
            return;
        }
        await onSubmit(submitData);
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
                    <td><input type="text" id="description" name="description" placeholder={t('field_description')}
                               value={description} onChange={(e) => setDescription(e.target.value)}/></td>
                </tr>
                <tr>
                    <td><label htmlFor="date">{t('field_date')}</label></td>
                    <td>
                        <DatePicker
                            name="date"
                            id="date"
                            dateFormat="yyyy-MM-dd HH:mm:ss"
                            showTimeSelect
                            selected={date}
                            locale={i18n.language}
                            onChange={(d: Date|null) => setDate(d)}
                        />
                        <br />
                        <small>(leave empty to keep current date and time)</small>
                    </td>
                </tr>
                <tr>
                    <td><label htmlFor="activity_type_id" className="required">{t('activity_type_title')}</label></td>
                    <td>
                        <div id="activity_type_id">
                            {activityTypes.map((activityType) => (<>
                                <input
                                    type="radio"
                                    name={`activity_type_id`}
                                    id={`activity_type_id_${activityType.id}`}
                                    key={activityType.id}
                                    value={activityType.id}
                                    onChange={(e) => setActivityTypeId(Number(e.target.value))}
                                    checked={activityType.id === activityTypeId}
                                    required
                                />
                                <label htmlFor={`activity_type_id_${activityType.id}`}>{activityType.name}</label>
                            </>))}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <button type="submit" className="btn-submit">{t(message)}</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </form>
    );
}
