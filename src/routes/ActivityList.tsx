import {useEffect, useState} from "react";
import {Link} from "react-router";
import {useTranslation} from "react-i18next";

import {Activity} from "../lib/entities/Activity.ts";
import ActivityType, {getActivityTypesList} from "../lib/entities/ActivityType.ts";
import api_call from "../lib/api_call.ts";
import ActivityTypesIcons from "../lib/components/ActivityTypesIcons.tsx";
import {success, error} from '../stores/flash_messages.ts';

export default function ActivityList() {
    const {t, i18n} = useTranslation();

    const [activities, setActivities] = useState<Activity[]>([]);
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
    const [selectedActivityType, setSelectedActivityType] = useState<number>(0);

    function fetchList() {
        const params = selectedActivityType ? { activity_type_id: selectedActivityType } : {};
        api_call<Activity[]>("activity_list", params)
            .then((activities_input: Activity[]): void => {
                if (!Array.isArray(activities_input)) { throw new Error('API type error'); }
                setActivities(activities_input.map((object: unknown) => Activity.from(object)));
            })
            .catch(e => error(t('error_api_generic')+"\n"+e?.toString()));
    }

    useEffect(() => {
        fetchList();
        getActivityTypesList().then(list => setActivityTypes(list)).catch(e => error(e.toString()));
    }, [selectedActivityType]);

    const dateFormatter = new Intl.DateTimeFormat(i18n.language, {
        dateStyle: "short",
        timeStyle: "short",
    });

    function formatDate(date: string): string {
        return dateFormatter.format(new Date(date));
    }

    function deleteActivity(activity: Activity) {
        if (!confirm(t('activity_delete_confirm'))) {
            return;
        }

        api_call("activity_delete", {id: activity.id})
            .then((res) => {
                if (Number(res) < 1) {
                    error(t('generic_item_not_found'));
                } else {
                    success(t('activity_removed_message', {id: activity.id}));
                }
                fetchList();
            })
            .catch(e => error(t('error_api_generic')+"\n"+e?.toString()));
    }

    return (
        <>
            <h2>{t('activities_title')}</h2>

            <nav className="subnav">
                <Link to="/activity/create" className="btn">➕ {t('activity_new')}</Link>
            </nav>

            <div className="types_icons">
                <label htmlFor="activityTypeFilter">{t('activity_filter_by_type')}</label>
                <ActivityTypesIcons activeId={selectedActivityType} onClick={(activityTypeId: number) => setSelectedActivityType(activityTypeId)} />
            </div>

            <table className="bordered">
                <thead>
                <tr>
                    <th>#</th>
                    <th>{t('field_date')}</th>
                    <th>{t('field_description')}</th>
                    <th>{t('field_type')}</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {!activities.length
                    ? (<tr><td colSpan={5}>No elements yet!</td></tr>)
                    : activities.map((activity, index) => (
                        <tr key={index}>
                            <td>{activity.id}</td>
                            <td>{formatDate(activity.date)}</td>
                            <td>{activity.description}</td>
                            <td>
                                {activity.activity_type_id ?
                                    activityTypes.find(at => at.id === activity.activity_type_id)?.name || `ID: ${activity.activity_type_id}` :
                                    '-'
                                }
                            </td>
                            <td>
                                <Link to={`/activity/edit/${activity.id}`} className="btn">✏️</Link>
                                <button type="button" onClick={() => deleteActivity(activity)}>🗑</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
