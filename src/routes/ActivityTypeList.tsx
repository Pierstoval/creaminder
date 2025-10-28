import {useEffect, useState} from "react";
import ActivityType, {getActivityTypesList} from "../lib/entities/ActivityType.ts";
import api_call from "../lib/api_call.ts";
import {Link} from "react-router";
import {useTranslation} from "react-i18next";
import { success, error } from '../stores/flash_messages.ts';

export default function ActivityTypeList() {
    const {t} = useTranslation();

    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);

    function fetchList() {
        getActivityTypesList().then(list => setActivityTypes(list)).catch(e => error(e.toString()));
    }

    useEffect(() => {
        fetchList();
    }, []);

    function deleteActivityType(activityType: ActivityType) {
        if (!confirm(t("activity_type_delete_confirm"))) {
            return;
        }

        api_call("activity_type_delete", {id: activityType.id})
            .then((res) => {
                if (Number(res) < 1) {
                    error(t('generic_item_not_found'));
                } else {
                    success(t('activity_type_removed_message', {name: activityType.name ||'no name'}));
                }
                fetchList();
            })
            .catch(e => {
                if (e.toString().trim() === 'FOREIGN KEY constraint failed') {
                    error(t('activity_type_error_delete_affects_activities'))
                } else {
                    error(t('error_api_generic') + "\n" + e.toString());
                }
            });
    }

    return (
        <>
            <h2>{t('activity_types_title')}</h2>

            <nav className="subnav">
                <Link to="/activity-type/create" className="btn">➕ {t('activity_type_new')}</Link>
            </nav>

            <table className="bordered">
                <thead>
                <tr>
                    <th>#</th>
                    <th>{t('field_name')}</th>
                    <th>{t('field_description')}</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {!activityTypes.length
                    ? (<tr>
                        <td colSpan={5}>{t('activity_type_no_item_message')}</td>
                    </tr>)
                    : activityTypes.map((activityType, index) => (
                        <tr key={index}>
                            <td>{activityType.id}</td>
                            <td>{activityType.name}</td>
                            <td>{activityType.description || '-'}</td>
                            <td>
                                <Link to={`/activity-type/edit/${activityType.id}`} className="btn">✏️</Link>
                                <button type="button" onClick={() => deleteActivityType(activityType)}>🗑</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
