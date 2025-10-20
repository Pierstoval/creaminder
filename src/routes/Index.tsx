import {Component, JSX} from "react";
import Activity from "../lib/entities/Activity.ts";
import api_call from "../lib/api_call.ts";

export default class Index extends Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            activities: [],
        };
    }

    componentDidMount() {
        api_call("list_activities").then((activities: Array<Activity>) => {
            this.setState({
                activities: activities
            });
        });
    }

    render(): JSX.Element {
        const list = this.state.activities;
        // let [list, setList] = useState<Array<Activity>>([]);

        //     api_call("list_activities").then((activities: Array<Activity>) => {
        //         console.info('received activities', activities);
        //         setList(activities);
        //     });
        return (
            <>
                <p>List:</p>
                {!list.length
                    ? 'No elements yet!'
                    : (<ul>
                        {list.map((activity, index) => <li key={index}>{activity.id} - {activity.title}</li>)}
                    </ul>)
                }
            </>
        );
    }
}
