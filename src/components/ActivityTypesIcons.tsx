import api_call from "../lib/api_call.ts";
import ActivityType from "../lib/entities/ActivityType.ts";
import {useEffect, useState} from "react";
import ActivityTypeIcon from "./ActivityTypeIcon.tsx";
import {useTranslation} from "react-i18next";

export default function ActivityTypesIcons({onClick, activeId}) {
    const [activityTypes, setActivityTypes] = useState([]);
    const {t} = useTranslation();

    useEffect(() => {
        api_call("activity_type_list")
            .then((activity_types_input: Array<object>) => {
                const activity_types = activity_types_input.map((object) => ActivityType.from(object));
                setActivityTypes(activity_types);
            })
            .catch(e => console.error('Could not fetch activity types!', e));
    }, [onClick]);

    return (
        <div>
            <button className="activity-icon" onClick={() => onClick(0)} title={t('button_reset')}>
                🚫 {t('button_reset')}
            </button>
            {activityTypes.map((activityType) => (
                <ActivityTypeIcon key={activityType.id} isActive={activityType.id == activeId} activityType={activityType} onClick={onClick}/>
            ))}
        </div>
    );
}
