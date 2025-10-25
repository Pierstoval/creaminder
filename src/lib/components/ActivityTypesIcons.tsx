import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import ActivityType, {getActivityTypesList} from "../entities/ActivityType.ts";
import ActivityTypeIcon from "./ActivityTypeIcon.tsx";
import {error} from "../../stores/flash_messages.ts";

export default function ActivityTypesIcons({onClick, activeId}: {onClick?: (id: number) => void, activeId?: number}) {
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
    const {t} = useTranslation();

    useEffect(() => {
        getActivityTypesList().then(list => setActivityTypes(list)).catch(e => error(e.toString()));
    }, [onClick]);

    function click(id: number) {
        if (!onClick) {
            return;
        }
        onClick(id);
    }

    return (
        <>
            <button className="activity-icon" onClick={() => click(0)} title={t('button_reset')}>
                🚫 {t('button_reset')}
            </button>
            {activityTypes.map((activityType) => (
                <ActivityTypeIcon isActive={activityType.id == activeId} activityType={activityType} onClick={click}/>
            ))}
        </>
    );
}
