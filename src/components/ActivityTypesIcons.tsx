import api_call from "../lib/api_call.ts";
import ActivityType from "../lib/entities/ActivityType.ts";
import {useEffect, useState} from "react";
import ActivityTypeIcon from "./ActivityTypeIcon.tsx";

export default function ActivityTypesIcons({onClick, activeId}) {
    const [activityTypes, setActivityTypes] = useState([]);

    console.info('mounting ActivityTypesIcons');

    useEffect(() => {
        api_call("activity_type_list")
            .then((activity_types_input: Array<object>) => {
                const activity_types = activity_types_input.map((object) => ActivityType.from(object));
                console.info('activity types', activity_types);
                setActivityTypes(activity_types);
            })
            .catch(e => console.error('Could not fetch activity types!', e));
    }, [onClick]);

    return (
        <div>
            <button className="activity-icon" onClick={() => onClick(0)} title="Reset">
                🚫 Reset
            </button>
            {activityTypes.map((activityType) => (
                <ActivityTypeIcon key={activityType.id} isActive={activityType.id == activeId} activityType={activityType} onClick={onClick}/>
            ))}
        </div>
    );
}
