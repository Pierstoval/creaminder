import {useEffect, useState} from "react";
import ActivityType from "../lib/entities/ActivityType.ts";
import api_call from "../lib/api_call.ts";
import Success from "../components/messages/Success.tsx";
import Errors from "../components/messages/Errors.tsx";
import {Link} from "react-router";
import {useTranslation} from "react-i18next";

export function ActivityTypeList() {
    const {t} = useTranslation();

    const [messages, setMessages] = useState("");
    const [errors, setErrors] = useState("");
    const [list, setList] = useState([]);

    function fetchList() {
        api_call("activity_type_list")
            .then((activity_types_input: Array<object>) => {
                const activity_types = activity_types_input.map((object) => ActivityType.from(object));
                setList(activity_types);
            })
            .catch(e => setErrors(t('error_api_generic')+"\n"+e.toString()));
    }

    useEffect(() => {
        fetchList();
    }, []);

    function deleteActivityType(activityType: ActivityType) {
        if (!confirm(t("activity_type_delete_confirm"))) {
            return;
        }

        api_call("activity_type_delete", {id: activityType.id})
            .then((res) => {
                if (res < 1) {
                    setErrors(t('generic_item_not_found'));
                } else {
                    setMessages(t('activity_type_removed_message', {name: activityType.name ||'no name'}));
                }
                fetchList();
            })
            .catch(e => setErrors(t('error_api_generic')+"\n"+e.toString()));
    }

    return (
        <>
            <h2>{t('activity_types_title')}</h2>

            <nav className="subnav">
                <Link to="/activity-type/create" className="btn">➕ {t('activity_type_new')}</Link>
            </nav>

            <Errors messages={errors}/>
            <Success messages={messages}/>
            <table className="bordered">
                <thead>
                <tr>
                    <th>#</th>
                    <th>{t('field_name')}</th>
                    <th>{t('field_description')}</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {!list.length
                    ? (<tr>
                        <td colSpan="5">{t('activity_type_no_item_message')}</td>
                    </tr>)
                    : list.map((activityType, index) => (
                        <tr key={index}>
                            <td>{activityType.id}</td>
                            <td>{activityType.name}</td>
                            <td>{activityType.description || '-'}</td>
                            <td>
                                <Link to={`/activity-type/edit/${activityType.id}`} className="btn">✏️</Link>
                                <button type="button" onClick={() => deleteActivityType(activityType)}>🗑</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
