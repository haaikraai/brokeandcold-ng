import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusControlService {
  private status: string = 'blank';
  private timer: number = 0;
  private statusQueue: string[] = [''];
  private statusActive: boolean = false;
  /**
   * Sets the status text for a short duration.
   * The text is cleared after 5 seconds.
   * @param message The status text to set.
   */
  addStatus(message: string): void {
    this.statusQueue.unshift(message);
    this.showStatus();

  }

  showStatus(): string {
    // I have unneeded variables here. I will remove them later.
    // But timeRemaining < 0 and statusActive checks for the same thing, that is whether a new status can be shown
    // const startedAt = Date.now();
    // const mustFinishBy = startedAt + 5000;
    // const timeRemaining = mustFinishBy - Date.now();
    
    console.log('Show status called:');
    console.log(this.statusQueue);

    if (!this.statusActive) {
      this.status = this.statusQueue.pop() ?? "";
      if (this.status.length > 0) {
        this.statusActive = true;
        this.timer = setTimeout(() => {
          this.status = '';
          this.statusActive = false;
          clearTimeout(this.timer);
          console.log('status cleared. Timer cleared.')
          if (this.statusQueue.length > 0) {
            this.showStatus();
          }
        }, 5000);  
      }
    }
    return this.status;

  }

  getStatus(): String {
    return this.status;
  }
}
