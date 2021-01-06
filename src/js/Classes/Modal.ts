import { MDCDialog } from '@material/dialog';
// import { MDCList } from '@material/list';

export class Modal {
  private dialog: MDCDialog;

  constructor() {
  }

  static create(): Modal {
    return new Modal();
  }

  render() {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="mdc-dialog">
        <div class="mdc-dialog__container">
          <div class="mdc-dialog__surface"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="my-dialog-title"
          aria-describedby="my-dialog-content">
          <div class="mdc-dialog__title">Action Confirmation</div>
            <div class="mdc-dialog__content" id="my-dialog-content">Are you sure you want to SignOut?</div>
            <div class="mdc-dialog__actions">
              <button id="modalButtonCancel" type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Cancel</span>
              </button>
              <button id="modalButtonOk" type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">SignOut</span>
              </button>
            </div>
          </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
      </div>
    `);

    this.dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
  }

  setOkHandler(fn: any) {
    document.querySelector('#modalButtonOk').addEventListener('click', () => {
      if (fn) {
        fn();
      }
    });
  }

  open() {
    this.dialog.open();
  }
}
