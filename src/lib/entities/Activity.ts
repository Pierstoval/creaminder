
export default class Activity {
    public id!: number;
    public title!: string;

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
    }
}
