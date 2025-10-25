import {useEffect, useState} from "react";
import {Link} from "react-router";
import {useTranslation} from "react-i18next";

import Activity from "../lib/entities/Activity.ts";
import ActivityType from "../lib/entities/ActivityType.ts";
import api_call from "../lib/api_call.ts";
import ActivityTypesIcons from "../lib/components/ActivityTypesIcons.tsx";
import {success, error} from '../stores/flash_messages.ts';

export default function ActivityList() {
    const {t} = useTranslation();

    const [list, setList] = useState([]);
    const [activityTypes, setActivityTypes] = useState([]);
    const [selectedActivityType, setSelectedActivityType] = useState("");

    function fetchList() {
        const params = selectedActivityType ? { activity_type_id: parseInt(selectedActivityType) } : {};
        api_call("activity_list", params)
            .then((activities_input: Array<object>) => {
                const activities = activities_input.map((object) => Activity.from(object));
                setList(activities);
            })
            .catch(e => error(t('error_api_generic')+"\n"+e.toString()));
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
        fetchList();
        fetchActivityTypes();
    }, []);

    useEffect(() => {
        fetchList();
    }, [selectedActivityType]);

    function deleteActivity(activity: Activity) {
        if (!confirm(t('activity_delete_confirm'))) {
            return;
        }

        api_call("activity_delete", {id: activity.id})
            .then((res) => {
                if (res < 1) {
                    error(t('generic_item_not_found'));
                } else {
                    success(t('activity_removed_message', {id: activity.id}));
                }
                fetchList();
            })
            .catch(e => error(t('error_api_generic')+"\n"+e.toString()));
    }

    return (
        <>
            <h2>{t('activities_title')}</h2>

            <nav className="subnav">
                <Link to="/activity/create" className="btn">➕ {t('activity_new')}</Link>
            </nav>

            <div>
                <label htmlFor="activityTypeFilter">{t('activity_filter_by_type')}</label>
                <ActivityTypesIcons activeId={selectedActivityType} onClick={(activityTypeId) => setSelectedActivityType(activityTypeId)} />
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
                {!list.length
                    ? (<tr><td colSpan="5">No elements yet!</td></tr>)
                    : list.map((activity, index) => (
                        <tr key={index}>
                            <td>{activity.id}</td>
                            <td>{activity.formattedDate}</td>
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
