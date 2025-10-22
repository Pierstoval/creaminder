
export default class Activity {
    public id!: number;
    public description!: string;
    public date!: Date;

    constructor(id: number, description: string, date: String) {
        this.id = id;
        this.description = description;
        this.date = new Date(date);
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

        return new Activity(object.id, object.description || '', object.date);
    }
}
