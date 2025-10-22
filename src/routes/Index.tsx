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
            {!list.length
                ? 'No elements yet!'
                : (<ul>
                    {list.map((activity, index) => <li key={index}>{activity.formattedDate} - {activity.description}</li>)}
                </ul>)
            }
        </>
    );
}
