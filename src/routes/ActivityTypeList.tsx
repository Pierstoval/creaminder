import {useEffect, useState} from "react";
import ActivityType from "../lib/entities/ActivityType.ts";
import api_call from "../lib/api_call.ts";
import Success from "../components/messages/Success.tsx";
import Errors from "../components/messages/Errors.tsx";
import {Link} from "react-router";

export default function ActivityTypeList() {
    console.info('mounting activity type list');

    const [messages, setMessages] = useState("");
    const [errors, setErrors] = useState("");
    const [list, setList] = useState([]);

    function fetchList() {
        api_call("activity_type_list")
            .then((activity_types_input: Array<object>) => {
                const activity_types = activity_types_input.map((object) => ActivityType.from(object));
                console.info('activity types', activity_types);
                setList(activity_types);
            })
            .catch(e => setErrors(e.messages));
    }

    useEffect(() => {
        fetchList();
    }, []);

    function deleteActivityType(id: number) {
        if (!confirm("Delete this activity type? This may affect existing activities.")) {
            return;
        }

        api_call("activity_type_delete", {id: id})
            .then((res) => {
                if (res < 1) {
                    setErrors('This activity type was not found.');
                } else {
                    setMessages('Successfully removed activity type number "' + id + '"');
                }
                fetchList();
            })
            .catch(e => setErrors(e.message));
    }

    return (
        <>
            <h2>Activity Types</h2>

            <nav className="subnav">
                <Link to="/activity-type/create" className="btn">➕ New activity type</Link>
            </nav>

            <Errors messages={errors} />
            <Success messages={messages} />
            <table className="bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {!list.length
                    ? (<tr><td colSpan="5">No activity types yet!</td></tr>)
                    : list.map((activityType, index) => (
                        <tr key={index}>
                            <td>{activityType.id}</td>
                            <td>{activityType.name}</td>
                            <td>{activityType.description || '-'}</td>
                            <td>
                                <Link to={`/activity-type/edit/${activityType.id}`} className="btn">✏️</Link>
                                <button type="button" onClick={() => deleteActivityType(activityType.id)}>🗑</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
