import api_call from "../api_call.ts";

export default class ActivityType {
    public id!: number;
    public name!: string;
    public description!: string | null;

    constructor(id: number, name: string, description: string | null) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    static from(object: Partial<ActivityType>): ActivityType {
        if (!object.id) {
            throw new Error('No id provided');
        }
        if (!object.name) {
            throw new Error('No name provided');
        }

        return new ActivityType(object.id, object.name, object.description || null);
    }
}

export async function getActivityTypesList(): Promise<ActivityType[]> {
    return api_call<ActivityType[]>("activity_type_list")
        .then((activity_types_input: ActivityType[]): ActivityType[] => {
            return activity_types_input.map((object) => ActivityType.from(object));
        });
}
