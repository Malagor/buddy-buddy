export interface INotification {
  groupsEl: NodeListOf<Element>;
  transactionsEl: NodeListOf<Element>;
  messagesEl: NodeListOf<Element>;
}

export enum TypeOfNotifications {
  Message,
  Group,
  Transaction
}

export class Notifications {
  private readonly groupsEl: NodeListOf<Element>;
  private readonly transactionsEl: NodeListOf<Element>;
  private readonly messagesEl: NodeListOf<Element>;
  private _messageCount: number = 0;
  private _transactionCount: number = 0;
  private _groupCount: number = 0;

  constructor(obj: INotification) {
    this.groupsEl = obj.groupsEl;
    this.transactionsEl = obj.transactionsEl;
    this.messagesEl = obj.messagesEl;
  }

  static create(elements: INotification): Notifications {
    return new Notifications((elements));
  }

  setNotificationMark = (type: TypeOfNotifications, num: number): void => {
    let elements: NodeListOf<Element> | null;
    let counter: number = 0;

    switch (type) {
      case TypeOfNotifications.Message:
        elements = this.messagesEl;
        this.messageCount += num;
        counter = this.messageCount;
        break;
      case TypeOfNotifications.Transaction:
        elements = this.transactionsEl;
        this.transactionCount += num;
        counter = this.transactionCount;
        break;
      case TypeOfNotifications.Group:
        elements = this.groupsEl;
        this.groupCount += num;
        counter = this.groupCount;
        break;
      default:
        elements = null;
        break;
    }

    if (elements) {
      if (counter) {
        elements.forEach(badge => {
          badge.textContent = counter.toString(10);
        });
      } else {
        elements.forEach(badge => {
          badge.textContent = '';
        });
      }
    }
  }

  decreaseNotificationMark(type: TypeOfNotifications): void {
    switch (type) {
      case TypeOfNotifications.Message:
        this.messageCount -= 1;
        this.setNotificationMark(TypeOfNotifications.Message, 0);
        break;

      case TypeOfNotifications.Group:
        this.groupCount -= 1;
        this.setNotificationMark(TypeOfNotifications.Group, 0);
        break;

      case TypeOfNotifications.Transaction:
        this.transactionCount -= 1;
        this.setNotificationMark(TypeOfNotifications.Transaction, 0);
        break;

      default:
        return;
    }
  }

  get messageCount(): number {
    return this._messageCount;
  }

  set messageCount(value: number) {
    this._messageCount = value;
  }

  get transactionCount(): number {
    return this._transactionCount;
  }

  set transactionCount(value: number) {
    this._transactionCount = value;
  }

  get groupCount(): number {
    return this._groupCount;
  }

  set groupCount(value: number) {
    this._groupCount = value;
  }
}
