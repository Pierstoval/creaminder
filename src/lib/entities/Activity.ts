import api_call from "../api_call.ts";

export type PartialActivity = {
    id: number;
    description: string | null;
    date: string | null;
    activity_type_id: number | null
};

export default class Activity {
    public _id!: number;
    public readonly description!: string;
    public date!: string;
    public readonly activity_type_id!: number | null;

    constructor(id: number, description: string, date: string, activity_type_id: number | null = null) {
        this._id = id;
        this.description = description;
        this.date = date;
        this.activity_type_id = activity_type_id;
    }

    get id(): number {
        return this._id;
    }

    set id(id: number) {
        if (this._id) {
            throw new Error('Cannot set an ID to an activity that already has one.');
        }
        this._id = id;
    }

    static from(object: unknown) {
        const input = {...(typeof object === 'object' ? object : {})} as Record<string, string>;
        if (!input?.date) {
            throw new Error('No date provided');
        }
        if (!input?.activity_type_id) {
            throw new Error('No activity type ID provided');
        }

        return new Activity(Number(input?.id), input?.description || '', input.date, Number(input.activity_type_id));
    }
}

export async function getActivitiesList(selectedActivityType?: number): Promise<Activity[]> {
    const params = selectedActivityType ? { activity_type_id: selectedActivityType } : {};

    return api_call<Activity[]>("activity_list", params)
        .then((activities_input: Activity[]): Activity[] => {
            if (!Array.isArray(activities_input)) { throw new Error('API type error'); }
            return activities_input.map((object: unknown) => Activity.from(object));
        });
}
