import {useEffect, useState} from "react";
import {Link} from "react-router";
import Activity from "../lib/entities/Activity.ts";
import ActivityType from "../lib/entities/ActivityType.ts";
import api_call from "../lib/api_call.ts";
import Success from "../components/messages/Success.tsx";
import Errors from "../components/messages/Errors.tsx";
import ActivityTypesIcons from "../components/ActivityTypesIcons.tsx";

export default function ActivityList() {
    console.info('mounting index');

    const [messages, setMessages] = useState("");
    const [errors, setErrors] = useState("");
    const [list, setList] = useState([]);
    const [activityTypes, setActivityTypes] = useState([]);
    const [selectedActivityType, setSelectedActivityType] = useState("");

    function fetchList() {
        const params = selectedActivityType ? { activity_type_id: parseInt(selectedActivityType) } : {};
        api_call("activity_list", params)
            .then((activities_input: Array<object>) => {
                const activities = activities_input.map((object) => Activity.from(object));
                console.info('activities', activities);
                setList(activities);
            })
            .catch(e => setErrors(e.messages));
    }

    function fetchActivityTypes() {
        api_call("activity_type_list")
            .then((activity_types_input: Array<object>) => {
                const activity_types = activity_types_input.map((object) => ActivityType.from(object));
                console.info('activity types', activity_types);
                setActivityTypes(activity_types);
            })
            .catch(e => setErrors(e.messages));
    }

    useEffect(() => {
        fetchList();
        fetchActivityTypes();
    }, []);

    useEffect(() => {
        fetchList();
    }, [selectedActivityType]);

    function deleteActivity(id: number) {
        if (!confirm("Delete?")) {
            return;
        }

        api_call("activity_delete", {id: id})
            .then((res) => {
                if (res < 1) {
                    setErrors('This item was not found.');
                } else {
                    setMessages('Successfully removed activity number "' + id + '"');
                }
                fetchList();
            })
            .catch(e => setErrors(e.message));
    }

    return (
        <>
            <h2>Activities</h2>

            <nav className="subnav">
                <Link to="/activity/create" className="btn">➕ New activity</Link>
            </nav>

            <div>
                <label htmlFor="activityTypeFilter">Filter by Activity Type: </label>
                <ActivityTypesIcons activeId={selectedActivityType} onClick={(activityTypeId) => setSelectedActivityType(activityTypeId)} />
            </div>

            <Errors messages={errors} />
            <Success messages={messages} />
            <table className="bordered">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Details</th>
                    <th>Type</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {!list.length
                    ? (<tr><td colSpan="5">No elements yet!</td></tr>)
                    : list.map((activity, index) => (
                        <tr key={index}>
                            <td>{activity.id}</td>
                            <td>{activity.formattedDate}</td>
                            <td>{activity.description}</td>
                            <td>
                                {activity.activity_type_id ?
                                    activityTypes.find(at => at.id === activity.activity_type_id)?.name || `ID: ${activity.activity_type_id}` :
                                    '-'
                                }
                            </td>
                            <td>
                                <button type="button" onClick={() => deleteActivity(activity.id)}>🗑</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
