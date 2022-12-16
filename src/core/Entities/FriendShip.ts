export type FirendShipProperties = {
  id: string;
  senderId: string;
  recipientId: string;
};

export class FriendShip {
  props: FirendShipProperties;

  constructor(props: FirendShipProperties) {
    this.props = props;
  }

  static create(props: { 
    id: string; senderId: string; recipientId: string 
}) {
    return new FriendShip({
      id: props.id,
      recipientId: props.recipientId,
      senderId: props.senderId,
    });
  }
}
