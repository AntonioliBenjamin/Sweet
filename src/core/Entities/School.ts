export type SchoolProperties = {
    id: string;
    name: string;
    city: string;
    district: string;
}

export class School {
    props: SchoolProperties;

    constructor(props: SchoolProperties) {
        this.props = props;
    }

    static create(props: {
        id: string;
        name: string;
        city: string;
        district: string;
    }) {
        return new School({
            id: props.id,
            name: props.name,
            city: props.city,
            district: props.district
        })
    }
}