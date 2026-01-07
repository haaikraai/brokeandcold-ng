import { Injectable } from "@angular/core";
import { TopbarComponent } from "./topbar/topbar.component";

@Injectable({
  providedIn: "root",
})
export class StatusControlService {
  private status: string = "blank";
  private timer: number = 0;
  private statusQueue: string[] = [];
  private statusActive: boolean = false;
  private DISPLAY_TIME = 5000;

  makeBackButton(topBar: TopbarComponent): void {
    topBar.
  }

  /**
   * Sets the status text for a short duration.
   * The text is cleared after 5 seconds.
   * @param message The status text to set.
   */
  addStatus(message: string): void {
    this.statusQueue.push(message);
    this.showStatus();
  }

  /**
   * Displays the current status. This should not be called by the user. Just keeping it public in case a situation arises.
   * It also controls the timing of the displayed text. It shows the status for 5 seconds, then
   *
   */
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
          this.status = "";
          this.statusActive = false;
          if (this.statusQueue.length > 0) {
            this.showStatus();
          }
        }, this.DISPLAY_TIME);
      }
    }
    return this.status;
  }

  /**
   * Sets the status text for a short duration. The new text is displayed immediately, overwriting any currently displayed text and removing any text qeued up to be displayed.
   * The text is cleared after 5 seconds.
   * @param message The status text to set.
   */
  addPriorityStatus(message: string) {
    this.status = message;
    this.statusQueue = []; // Clear the queue
    this.statusActive = true;
    clearTimeout(this.timer);
    this.timer = setTimeout(
      () => {
        this.status = "";
        this.statusActive = false;
        // After the priority message, check if other messages were added in the meantime.
        if (this.statusQueue.length > 0) {
          this.showStatus();
        }
      },
      Math.ceil(this.DISPLAY_TIME * 1.5),
    ); //Make the priority displays 1.5 times longer
  }

  getStatus(): string {
    return this.status;
  }
}
