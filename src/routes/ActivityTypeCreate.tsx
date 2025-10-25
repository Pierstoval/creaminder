import api_call from "../lib/api_call.ts";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import { success, error } from '../stores/flash_messages.ts';

export default function ActivityTypeCreate() {
    const {t} = useTranslation();
    const navigate = useNavigate();

    let [name, setName] = useState('');
    let [description, setDescription] = useState('');

    async function create(formData: FormData): Promise<unknown> {
        const data = {
            name: formData.get('name')?.toString(),
            description: formData.get('description')?.toString() || null,
        };
        try {
            await api_call('activity_type_create', data);
            await navigate(`/activity-type/list`);
            success(t('activity_type_created_message'));
        } catch (e) {
            error(t('error_api_generic')+"\n"+e.toString());
        }
    }

    return (
        <>
            <h2>{t('activity_type_title_create')}</h2>

            <form action={create}>
                <table>
                    <tbody>
                        <tr>
                            <td><label htmlFor="name" required>{t('field_name')}</label></td>
                            <td><input type="text" name="name" placeholder={t('field_name')} required value={name} onChange={(e) => setName(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="description">{t('field_description')}</label></td>
                            <td>
                                <textarea name="description" placeholder={t('field_description')} value={description} onChange={(e) => setDescription(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><button type="submit">{t('button_create')}</button></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </>
    );
}
