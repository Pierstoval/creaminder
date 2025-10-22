import {useEffect, useState} from "react";
import Activity from "../lib/entities/Activity.ts";
import api_call from "../lib/api_call.ts";

export default function () {
    console.info('mounting index');

    const [list, setList] = useState([]);

    useEffect(() => {
        api_call("activity_list").then((activities_input: Array<object>) => {
            const activities = activities_input.map((object) => Activity.from(object));
            console.info('activities', activities);
            setList(activities);
        })
            .catch(e => console.error(e));
    }, []);

    return (
        <>
            <p>Latest activities:</p>

            <table className="bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                {!list.length
                    ? (<tr>No elements yet!</tr>)
                    : list.map((activity, index) => (
                        <tr key={index}>
                            <td>{activity.id}</td>
                            <td>{activity.formattedDate}</td>
                            <td>{activity.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
