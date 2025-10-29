import {useEffect, useState} from "react";
import Activity, {getActivitiesList} from "../lib/entities/Activity.ts";
import ActivityType, {getActivityTypesList} from "../lib/entities/ActivityType.ts";
import {error} from "../stores/flash_messages.ts";
import {useTranslation} from "react-i18next";
import {default as LightweightCalendar} from 'react-lightweight-calendar';
import ActivityTypesIcons from "../lib/components/ActivityTypesIcons.tsx";
import {ColorDot} from "react-lightweight-calendar/dist/components/Calendar/Calendar.types";
import {fr, enGB} from 'date-fns/locale';

export default function Calendar() {
    const {t, i18n} = useTranslation();
    const [calendarData, setCalendarData] = useState<Record<string, any>[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
    const [selectedActivityType, setSelectedActivityType] = useState<number>(0);

    function getActivityTypeById(id: number): ActivityType | null {
        const data = activityTypes.filter(item => item.id === id);
        return [...data][0] ?? null;
    }

    useEffect(() => {
        getActivitiesList(selectedActivityType).then(list => setActivities(list)).catch(e => error(t('error_api_generic')+"\n"+e?.toString()));
        getActivityTypesList().then(list => setActivityTypes(list)).catch(e => error(t('error_api_generic')+"\n"+e?.toString()));
    }, [selectedActivityType]);

    useEffect(() => {
        const data: Record<string, any>[] = activities.map(activity => ({
            id: activity.id,
            startTime: activity.date,
            endTime: activity.date,
            title: getActivityTypeById(Number(activity.activity_type_id))?.name || "❓",
        }));
        console.info('Calendar data', data);
        setCalendarData(data);
    }, [selectedActivityType, activityTypes, activities]);

    function renderItem(item: Record<string, any>) {
        console.info({item});
        return item.title;
    }

    return (<>

        <div className="types_icons">
            <label htmlFor="activityTypeFilter">{t('activity_filter_by_type')}</label>
            <ActivityTypesIcons activeId={selectedActivityType} onClick={(activityTypeId: number) => setSelectedActivityType(activityTypeId)} />
        </div>

        <LightweightCalendar
            data={calendarData}
            activeTimeDateField="startTime"
            renderItemText={renderItem}
            locale={i18n.language === 'fr' ? fr : (i18n.language === 'en' ? enGB : enGB)}
        />
    </>);
}
