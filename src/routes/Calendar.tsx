import {useEffect, useState} from "react";
import {Activity} from "../lib/entities/Activity.ts";
import ActivityType, {getActivityTypesList} from "../lib/entities/ActivityType.ts";
import api_call from "../lib/api_call.ts";
import {error} from "../stores/flash_messages.ts";
import {useTranslation} from "react-i18next";
import {default as LightweightCalendar} from 'react-lightweight-calendar';
import ActivityTypesIcons from "../lib/components/ActivityTypesIcons.tsx";

export default function Calendar() {
    const {t} = useTranslation();
    const [calendarData, setCalendarData] = useState<Record<string, any>[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
    const [selectedActivityType, setSelectedActivityType] = useState<number>(0);

    function getActivityTypeById(id: number): ActivityType | null {
        const data = activityTypes.filter(item => item.id === id);
        return [...data][0] ?? null;
    }

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

    useEffect(() => {
        const data: Record<string, any> = [];

        activities.forEach(activity => {
            data.push({
                id: activity.id,
                startTime: activity.date,
                endTime: activity.date,
                title: getActivityTypeById(Number(activity.activity_type_id))?.name || "❓",
            })
        })

        console.info('Calendar data', data);
        setCalendarData(data);
    }, [selectedActivityType, activityTypes, activities]);

    return (<>

        <div className="types_icons">
            <label htmlFor="activityTypeFilter">{t('activity_filter_by_type')}</label>
            <ActivityTypesIcons activeId={selectedActivityType} onClick={(activityTypeId: number) => setSelectedActivityType(activityTypeId)} />
        </div>

        <LightweightCalendar
            data={calendarData}
            activeTimeDateField="startTime"
        />
    </>);
}
