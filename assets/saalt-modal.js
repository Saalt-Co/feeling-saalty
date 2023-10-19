class SaaltModal extends HTMLElement {
  constructor() {
    super();
    this.modal = this;
    this.modalBtn = document.querySelector(this.dataset.modalButton);
  }

  connectedCallback() {
    this.modalBtn.addEventListener('click', this.openPopup.bind(this), false);
    this.addEventListener('click', this.handleClosePopup.bind(this), false);
    window.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'Escape') {
          this.handleClosePopup(e);
        }
      },
      false
    );
  }

  disconnectedCallback() {}

  openPopup = (e) => {
    if (!a11yClick(e)) return;
    this.modal.classList.add('reveal-modal');
    this.modal.querySelector('.close-button').focus();
  };

  handleClosePopup = (e) => {
    if (!a11yClick(e) && !a11yEsc(e)) return;
    if (e.target.closest('.chart-wrapper')) return;
    this.modal.classList.add('hide-modal');
    const timer = setTimeout(() => {
      this.modal.classList.remove('hide-modal');
      this.modal.classList.remove('reveal-modal');
      clearTimeout(timer);
    }, 500);
    this.modal.querySelector('.chart-button').focus();
  };
}

customElements.define('saalt-modal', SaaltModal);
