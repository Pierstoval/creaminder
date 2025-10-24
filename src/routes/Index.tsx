import {useEffect, useState} from "react";
import Activity from "../lib/entities/Activity.ts";
import api_call from "../lib/api_call.ts";
import Success from "../components/messages/Success.tsx";
import Errors from "../components/messages/Errors.tsx";

export default function () {
    console.info('mounting index');

    const [messages, setMessages] = useState("");
    const [errors, setErrors] = useState("");
    const [list, setList] = useState([]);

    function fetchList() {
        api_call("activity_list")
            .then((activities_input: Array<object>) => {
                const activities = activities_input.map((object) => Activity.from(object));
                console.info('activities', activities);
                setList(activities);
            })
            .catch(e => setErrors(e.messages));
    }

    useEffect(() => {
        fetchList();
    }, []);

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
            <p>Latest activities:</p>

            <Errors messages={errors} />
            <Success messages={messages} />
            <table className="bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Details</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {!list.length
                    ? (<tr><td colSpan="4">No elements yet!</td></tr>)
                    : list.map((activity, index) => (
                        <tr key={index}>
                            <td>{activity.id}</td>
                            <td>{activity.formattedDate}</td>
                            <td>{activity.description}</td>
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
