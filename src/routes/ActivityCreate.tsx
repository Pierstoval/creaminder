import api_call from "../lib/api_call.ts";
import {useState} from "react";

export default function ActivityCreate() {
    let [errors, setErrors] = useState([]);
    let [pending, setPending] = useState(false);

    function create(formData: FormData): Promise<unknown> {
        if (pending) {
            console.info('already sending...');
            return;
        }
        console.info('sending...');
        setPending(true);
        return new Promise(resolve => {
            console.info('setting timeout...');
            setTimeout(() => {
                api_call('activity_create', {
                    description: formData.get('description'),
                    date: formData.get('date') ? (formData.get('date')+":00Z") : null,
                })
                    .then(result => console.info('Success!', result))
                    .catch(e => {
                        console.info('errors...', e);
                        setErrors([e.toString()]);
                    })
                    .finally(() => {
                        console.info('finally...');
                        setPending(false);
                        resolve();
                    })
                ;
            }, 1250);
        });
    }

    function click() {
        document.querySelector('input[name="date"]').value = "2025-01-01T00:00:00";
    }

    return (
        <>
            <h2>Create new activity</h2>

            <button onClick={click}>set date</button>
            <div className="errors">
                {!errors.length && (
                    <ul>
                        {errors.map((message, index) => <li key={index}>{message}</li>)}
                    </ul>
                )}
            </div>

            <form action={create}>
                <table>
                    <tbody>
                        <tr>
                            <td><label htmlFor="description" required>Title</label></td>
                            <td><input type="text" name="description" placeholder="Title" required /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="date">Date</label></td>
                            <td>
                                <input type="datetime-local" name="date" placeholder="Date" />
                                &nbsp;<small>(leave empty to set the current date)</small>
                            </td>
                        </tr>
                        <tr>
                            <td>{pending ? 'pending' : 'not pending'}</td>
                            <td><button type="submit" disabled={pending}>Submit</button></td>
                        </tr>
                    </tbody>
                </table>

            </form>
        </>
    );
}
