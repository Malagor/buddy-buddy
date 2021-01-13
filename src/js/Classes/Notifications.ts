export interface INotification {
  groupsEl: NodeListOf<Element>;
  transactionsEl: NodeListOf<Element>;
  messagesEl: NodeListOf<Element>;
}

export class Notifications {
  private groupsEl: NodeListOf<Element>;
  private transactionsEl: NodeListOf<Element>;
  private messagesEl: NodeListOf<Element>;
  private _newMessageCount: number = 0;

  constructor(obj: INotification) {
    this.groupsEl = obj.groupsEl;
    this.transactionsEl = obj.transactionsEl;
    this.messagesEl = obj.messagesEl;
  }

  static create(elements: INotification): Notifications {
    return new Notifications((elements));
  }

  sentGroupNotification = (num: number | null): void => {
    this.groupsEl.forEach(badge => {
      badge.textContent = num.toString(10);
    });
  }

  sentTransactionNotification = (num: number | null): void => {
    this.transactionsEl.forEach(badge => {
      badge.textContent = num.toString(10);
    });
  }

  sentMessageNotification = (num: number | null): void => {
    console.log('this.newMessageCount', this.newMessageCount);
    console.log('num', num);
    this.newMessageCount += num;
    if (this.newMessageCount) {
      this.messagesEl.forEach(badge => {
        badge.textContent = num.toString(10);
      });
    } else {
      this.messagesEl.forEach(badge => {
        badge.textContent = '';
      });
    }
  }

  get newMessageCount(): number {
    return this._newMessageCount;
  }

  set newMessageCount(value: number) {
    this._newMessageCount = value;
  }
}
