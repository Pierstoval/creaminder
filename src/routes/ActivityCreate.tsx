import { useFormStatus } from "react-dom";
import api_call from "../lib/api_call.ts";
import {useState} from "react";

export default function ActivityCreate() {
    let [errors, setErrors] = useState([]);

    let pending: boolean = false;

    function create(formData: FormData): Promise<unknown> {
        pending = true;
        console.info('Sending...');
        console.info('formData', formData);
        const apiCallData = {
            description: formData.get('description'),
            date: formData.get('date') || null,
        };
        return api_call('activity_create', apiCallData)
            .then(result => console.info('Success!', result))
            .catch(e => setErrors([e.toString()]))
            .finally(() => pending = false)
        ;
    }

    return (
        <>
            <h2>Create new activity</h2>

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
                            <td></td>
                            <td><button type="submit" disabled={pending}>Submit</button></td>
                        </tr>
                    </tbody>
                </table>

            </form>
        </>
    );
}
