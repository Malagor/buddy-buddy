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

  setGroupNotification = (num: number): void => {
    this.groupCount += num;
    if (this.groupCount) {
      this.groupsEl.forEach(badge => {
        badge.textContent = this.groupCount.toString(10);
      });
    } else {
      this.groupsEl.forEach(badge => {
        badge.textContent = '';
      });
    }
  }

  decreaseGroupNotification() {
    this.groupCount -= 1;
    this.setGroupNotification(0);
  }

  setTransactionNotification = (num: number): void => {
    this.transactionCount += num;
    if (this.transactionCount) {
      this.transactionsEl.forEach(badge => {
        badge.textContent = this.transactionCount.toString(10);
      });
    } else {
      this.transactionsEl.forEach(badge => {
        badge.textContent = '';
      });
    }
  }

  decreaseTransactionNotification() {
    this.transactionCount -= 1;
    this.setTransactionNotification(0);
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
