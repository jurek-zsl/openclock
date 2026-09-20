/**
 * Quick Chat & Emoji Reaction Manager
 */

export class QuickChat {
  constructor(onEmojiSelected) {
    this.onEmojiSelected = onEmojiSelected;
    this.modal = document.getElementById('emoji-modal');
    this.isOpen = false;

    this.setupListeners();
  }

  setupListeners() {
    if (!this.modal) return;

    // Attach click to all emoji buttons
    const buttons = this.modal.querySelectorAll('.emoji-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const emoji = btn.getAttribute('data-emoji');
        if (emoji && this.onEmojiSelected) {
          this.onEmojiSelected(emoji);
        }
        this.close();
      });
    });

    // Close on click outside
    window.addEventListener('click', (e) => {
      if (this.isOpen && !e.target.closest('#emoji-modal') && !e.target.closest('#btn-touch-emoji')) {
        this.close();
      }
    });

    // Close on Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.modal) {
      this.modal.classList.remove('hidden');
      this.isOpen = true;
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.add('hidden');
      this.isOpen = false;
    }
  }
}
