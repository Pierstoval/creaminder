import {useState} from "react";
import "./App.css";
import Activity from './lib/entities/Activity.ts';
import api_call from "./lib/api_call.ts";

function List(list: Array<any>) {
    return <ul>
        {list.map(activity => <li>{activity.id} - {activity.title}</li>)}
    </ul>;
}

function App() {
    console.info('Mounting App.');

    let [list, setList] = useState<Array<Activity>>([]);

    api_call("list_activities").then((json_string: string) => {
        const new_list = JSON.parse(json_string);
        if (Array.isArray(new_list)) {
            console.info('New list', new_list);
            setList(new_list);
        } else {
            console.error('Received JSON is not valid:', json_string);
        }
    });

    return (
        <main>
            <h1>Welcome to Tauri + React</h1>

            <p>List:</p>
            {!list.length ? 'No elements yet!' : List(list)}
        </main>
    );
}

export default App;
