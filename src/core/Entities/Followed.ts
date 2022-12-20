export type FollowedProperties = {
  id: string;
  addedBy: string;
  userId: string;
};

export class Followed {
  props: FollowedProperties;

  constructor(props: FollowedProperties) {
    this.props = props;
  }

  static create(props: { 
    id: string; addedBy: string; userId: string 
}) {
    return new Followed({
      id: props.id,
      userId: props.userId,
      addedBy: props.addedBy,
    });
  }
}
