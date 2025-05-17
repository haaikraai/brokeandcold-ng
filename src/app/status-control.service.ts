import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusControlService {
  private status: string = 'blank';
  private timer: number = 0;
  private statusQueue: string[] = [''];
  private statusActive: boolean = false;
  private DISPLAY_TIME = 5000;
  /**
   * Sets the status text for a short duration.
   * The text is cleared after 5 seconds.
   * @param message The status text to set.
   */
  addStatus(message: string): void {
    this.statusQueue.push(message);
    this.showStatus();

  }


  showStatus(): string {
    // I have unneeded variables here. I will remove them later.
    // But timeRemaining < 0 and statusActive checks for the same thing, that is whether a new status can be shown
    // const startedAt = Date.now();
    // const mustFinishBy = startedAt + 5000;
    // const timeRemaining = mustFinishBy - Date.now();
    
    if (!this.statusActive) {
      this.status = this.statusQueue.shift() ?? "";
      if (this.status.length > 0) {
        this.statusActive = true;
        this.timer = setTimeout(() => {
          this.status = '';
          this.statusActive = false;
          clearTimeout(this.timer);
          if (this.statusQueue.length > 0) {
            this.showStatus();
          }
        }, this.DISPLAY_TIME);  
      }
    }
    return this.status;
  }

  addPriorityStatus(message: string) {
    this.status = message;
    this.statusQueue = [message];
    this.statusActive = true;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.status = '';
      this.statusActive = false;
      this.statusQueue = [''];
      console.log('status blanked, timer dont-give-a-damn');
    }, this.DISPLAY_TIME);
    
  }

  getStatus(): String {
    return this.status;
  }
}
