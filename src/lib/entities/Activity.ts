
export default class Activity {
    public id!: number;
    public description!: string;
    public date!: Date;
    public activity_type_id!: number | null;

    constructor(id: number, description: string, date: string, activity_type_id: number | null = null) {
        this.id = id;
        this.description = description;
        this.date = new Date(date);
        this.activity_type_id = activity_type_id;
    }

    get formattedDate() {
        return this.date.toLocaleDateString()+" "+this.date.toLocaleTimeString([], {
            timeStyle: 'short',
        });
    }

    static from(object: unknown) {
        const input = {...(typeof object === 'object' ? object : {})} as Record<string, string>;
        if (!input?.id) {
            throw new Error('No id provided');
        }
        if (!input?.date) {
            throw new Error('No date provided');
        }
        if (!input?.activity_type_id) {
            throw new Error('No activity type ID provided');
        }

        return new Activity(Number(input.id), input?.description || '', input.date, Number(input.activity_type_id));
    }

    asObject(): Record<string, unknown> {
        return {
            id: this.id,
            description: this.description,
            date: this.date,
            activity_type_id: this.activity_type_id,
        };
    }
}
