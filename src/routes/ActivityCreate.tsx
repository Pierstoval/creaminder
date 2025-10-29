import api_call from "../lib/api_call.ts";
import {useTranslation} from "react-i18next";
import { error, success } from '../stores/flash_messages.ts';
import {useNavigate} from "react-router";
import Activity, {PartialActivity} from "../lib/entities/Activity.ts";
import ActivityForm from "../lib/components/ActivityForm.tsx";

export default function ActivityCreate() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    async function onSubmit(data: PartialActivity): Promise<void> {
        try {
            const newActivity = await api_call<Activity>('activity_create', data);
            await navigate(`/activity/list`);
            let identifier = (newActivity.description||newActivity.id||'').toString();
            if (identifier.length > 0) {
                identifier = `"${identifier}"`;
            }
            success(t('activity_created_message', {name: identifier}));
        } catch (e) {
            error(t('error_api_generic')+"\n"+e?.toString());
        }
    }

    return (
        <>
            <h2>{t('activity_new')}</h2>

            <ActivityForm onSubmit={onSubmit} type="create" />
        </>
    );
}
