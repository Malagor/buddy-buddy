export abstract class Page {
  protected element: HTMLElement;

  protected constructor(element: string) {
    this.element = document.querySelector(element);
  }

  abstract render(data?: any): void;

  protected events(): void {
    throw new Error('Need implement method events()!');
  }
}
