export interface INotification {
  groupsEl: NodeListOf<Element>;
  transactionsEl: NodeListOf<Element>;
  messagesEl: NodeListOf<Element>;
}

export class Notifications {
  private groupsEl: NodeListOf<Element>;
  private transactionsEl: NodeListOf<Element>;
  private messagesEl: NodeListOf<Element>;

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
    this.messagesEl.forEach(badge => {
      badge.textContent = num.toString(10);
    });
  }
}
