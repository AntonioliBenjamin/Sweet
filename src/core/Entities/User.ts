import { UserErrors } from "../errors/UserErrors";

export enum Gender {
  BOY = "boy",
  GIRL = "girl",
}

export type UserProperties = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  schoolId: string;
  section: string;
  gender: Gender;
  createdAt: Date;
  updatedAt: Date;
};

export class User {
  props: UserProperties;

  constructor(props: UserProperties) {
    this.props = props;
  }

  static create(props: {
    id: string;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    age: number;
    schoolId: string;
    section: string;
    gender: Gender;
    password: string;
  }) {
    if (props.age < 13) {
      throw new UserErrors.TooYoung();
    }
    return new User({
      id: props.id,
      userName: props.userName.toLowerCase().trim(),
      firstName: props.firstName,
      lastName: props.lastName,
      schoolId: props.schoolId,
      section: props.section,
      age: props.age,
      gender: props.gender,
      email: props.email.toLowerCase().trim(),
      password: props.password,
      createdAt: new Date(),
      updatedAt: null,
    });
  }

  update(props: {
    userName: string;
    firstName: string;
    lastName: string;
    age: number;
    section: string;
  }) {
    if (props.age < 13) {
        throw new UserErrors.TooYoung();
      }
    this.props.userName = props.userName.toLowerCase().trim();
    this.props.firstName = props.firstName;
    this.props.lastName = props.lastName;
    this.props.age = props.age;
    this.props.section = props.section;
    this.props.updatedAt = new Date();
  }
}
