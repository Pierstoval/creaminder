export default function ActivityTypeIcon({activityType, onClick, isActive}) {
    const className = `activity-icon ${isActive ? 'active' : ''}`;

    return (
        <button className={className}  onClick={() => onClick(activityType.id)} title={activityType.description}>
            {activityType.name}
        </button>
    );
}
