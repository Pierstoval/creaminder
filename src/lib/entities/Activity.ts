
export default class Activity {
    public id!: number;
    public description!: string;
    public date!: Date;
    public activity_type_id!: number | null;

    constructor(id: number, description: string, date: String, activity_type_id: number | null = null) {
        this.id = id;
        this.description = description;
        this.date = new Date(date);
        this.activity_type_id = activity_type_id;
    }

    get formattedDate() {
        return this.date.toLocaleDateString()+" "+this.date.toLocaleTimeString()+"+0000";
    }

    static from(object: object) {
        if (!object.id) {
            throw new Error('No id provided');
        }
        if (!object.date) {
            throw new Error('No date provided');
        }

        return new Activity(object.id, object.description || '', object.date, object.activity_type_id || null);
    }
}
