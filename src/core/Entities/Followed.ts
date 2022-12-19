export type FollowedProperties = {
  id: string;
  senderId: string;
  recipientId: string;
};

export class Followed {
  props: FollowedProperties;

  constructor(props: FollowedProperties) {
    this.props = props;
  }

  static create(props: { 
    id: string; senderId: string; recipientId: string 
}) {
    return new Followed({
      id: props.id,
      recipientId: props.recipientId,
      senderId: props.senderId,
    });
  }
}
