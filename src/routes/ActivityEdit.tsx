import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import api_call from "../lib/api_call.ts";
import { success, error } from '../stores/flash_messages.ts';
import Activity, {PartialActivity} from "../lib/entities/Activity.ts";
import ActivityForm from "../lib/components/ActivityForm.tsx";
import Loader from "../lib/components/Loader.tsx";

export default function ActivityEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    let [activity, setActivity] = useState<null|Activity>(null);

    useEffect(() => {
        api_call<Activity>('activity_find_by_id', { id: Number(id || 0) })
            .then((activity) => {
                if (!activity) {
                    error(t('generic_item_not_found'));
                    navigate('/activity/list');
                }
                setActivity(activity as Activity);
            })
            .catch((e) => {
                error(t('error_api_generic')+"\n"+e?.toString());
            });
    }, [id]);

    if (!id?.toString().trim()) {
        navigate('/activity/list');
        return;
    }

    async function onSubmit(data: PartialActivity): Promise<void> {
        try {
            const newActivity: Activity = await api_call<Activity>('activity_update', {...data});
            await navigate(`/activity/list`);
            let identifier = (newActivity.description||newActivity.id||'').toString();
            if (identifier.length > 0) {
                identifier = `"${identifier}"`;
            }
            success(t('activity_updated_message', {name: identifier}));
        } catch (e) {
            error(t('error_api_generic')+"\n"+e?.toString());
        }
    }

    return (
        <>
            <h2>{t('activity_edit')}</h2>

            {!activity ? <Loader fullWidth /> : <ActivityForm onSubmit={onSubmit} type="update" data={activity} />}
        </>
    );
}
