import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import api_call from "../api_call.ts";
import ActivityType from "../entities/ActivityType.ts";
import ActivityTypeIcon from "./ActivityTypeIcon.tsx";
import { error } from '../../stores/flash_messages.ts';

export default function ActivityTypesIcons({onClick, activeId}) {
    const [activityTypes, setActivityTypes] = useState([]);
    const {t} = useTranslation();

    useEffect(() => {
        api_call("activity_type_list")
            .then((activity_types_input: Array<object>) => {
                const activity_types = activity_types_input.map((object) => ActivityType.from(object));
                setActivityTypes(activity_types);
            })
            .catch(e => error(t('api_generic_error')+' ActivityType Not Found'));
    }, [onClick]);

    return (
        <div>
            <button className="activity-icon" onClick={() => onClick(0)} title={t('button_reset')}>
                🚫 {t('button_reset')}
            </button>
            {activityTypes.map((activityType) => (
                <span key={activityType.id}>
                    <ActivityTypeIcon isActive={activityType.id == activeId} activityType={activityType} onClick={onClick}/>
                </span>
            ))}
        </div>
    );
}
