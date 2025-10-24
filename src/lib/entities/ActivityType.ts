export default class ActivityType {
    public id!: number;
    public name!: string;
    public description!: string | null;

    constructor(id: number, name: string, description: string | null) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    static from(object: any) {
        if (!object.id) {
            throw new Error('No id provided');
        }
        if (!object.name) {
            throw new Error('No name provided');
        }

        return new ActivityType(object.id, object.name, object.description || null);
    }
}
