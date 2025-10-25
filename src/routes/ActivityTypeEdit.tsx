import api_call from "../lib/api_call.ts";
import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import { success, error } from '../stores/flash_messages.ts';

export default function ActivityTypeEdit() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    let [name, setName] = useState('');
    let [description, setDescription] = useState('');

    useEffect(() => {
        if (id) {
            api_call('activity_type_find_by_id', { id: parseInt(id) })
                .then((activityType: any) => {
                    setName(activityType.name);
                    setDescription(activityType.description || '');
                })
                .catch((e) => {
                    error(t('error_api_generic')+"\n"+e?.toString());
                });
        }
    }, [id]);

    async function update(formData: FormData): Promise<void> {
        const data = {
            id: parseInt(id!),
            name: formData.get('name')?.toString(),
            description: formData.get('description')?.toString() || null,
        };
        try {
            await api_call('activity_type_update', data);
            success(t('activity_type_updated_message'));
            await navigate(`/activity-type/list`);
        } catch (e) {
            error(t('error_api_generic')+"\n"+e?.toString());
        }
    }

    return (
        <>
            <h2>{t('activity_type_title_edit')}</h2>

            <form action={update}>
                <table>
                    <tbody>
                        <tr>
                            <td><label htmlFor="name" className="required">{t('field_name')}</label></td>
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
                            <td>
                                <button type="submit">{t('button_update')}</button>
                                <button type="button" onClick={() => navigate('/activity-type/list')}>{t('button_back')}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </>
    );
}
