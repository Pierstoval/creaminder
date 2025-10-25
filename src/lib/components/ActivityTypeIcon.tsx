import ActivityType from "../entities/ActivityType.ts";

export default function ActivityTypeIcon(
    {activityType, onClick, isActive}:
    {activityType: ActivityType, onClick?: (id: number) => void, isActive?: boolean}
) {
    const className = `activity-icon ${isActive ? 'active' : ''}`;

    function click(id: number) {
        if (!onClick) {
            return;
        }
        onClick(id);
    }

    return (
        <button className={className}  onClick={() => click(activityType.id)} title={activityType.description||''}>
            {activityType.name}
        </button>
    );
}
