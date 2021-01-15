export interface INotification {
  groupsEl: NodeListOf<Element>;
  transactionsEl: NodeListOf<Element>;
  messagesEl: NodeListOf<Element>;
}

export class Notifications {
  private groupsEl: NodeListOf<Element>;
  private transactionsEl: NodeListOf<Element>;
  private messagesEl: NodeListOf<Element>;
  private _messageCount: number = 0;

  constructor(obj: INotification) {
    this.groupsEl = obj.groupsEl;
    this.transactionsEl = obj.transactionsEl;
    this.messagesEl = obj.messagesEl;
  }

  static create(elements: INotification): Notifications {
    return new Notifications((elements));
  }

  setGroupNotification = (num: number | null): void => {
    this.groupsEl.forEach(badge => {
      badge.textContent = num.toString(10);
    });
  }

  setTransactionNotification = (num: number | null): void => {
    this.transactionsEl.forEach(badge => {
      badge.textContent = num.toString(10);
    });
  }

  setMessageNotification = (num: number): void => {
    this.messageCount += num;
    if (this.messageCount) {
      this.messagesEl.forEach(badge => {
        badge.textContent = this.messageCount.toString(10);
      });
    } else {
      this.messagesEl.forEach(badge => {
        badge.textContent = '';
      });
    }
  }

  get messageCount(): number {
    return this._messageCount;
  }

  set messageCount(value: number) {
    this._messageCount = value;
  }
}
