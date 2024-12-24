import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusControlService {
  private status = 'blank';

  /**
   * Sets the status text for a short duration.
   * The text is cleared after 5 seconds.
   * @param message The status text to set.
   */
  setStatus(message: string): void {
    this.status = message;
    setTimeout(() => {
      this.status = '';
    }, 5000);
  }

  getStatus(): string {
    return this.status;
  }
}
