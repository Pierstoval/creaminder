export default function ActivityTypeIcon({key, activityType, onClick, isActive}) {
    const className = `activity-icon ${isActive ? 'active' : ''}`;

    return (<>
        <button class={className} key={key} onClick={() => onClick(activityType.id)} title={activityType.description}>
            {activityType.name}
        </button>
    </>);
}
