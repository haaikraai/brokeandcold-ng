import { inject, Injectable } from '@angular/core';
import { StatusControlService } from './status-control.service';
import { Transaction } from './transaction';
import { LedgerBook } from './LedgerBook';

// Define constant outside the class or as a static member
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable({
  providedIn: 'root',
})
export class BeanServiceService {

  private statusControl = inject(StatusControlService)

  balanceData = {
    balance: 0,
    lastUpdated: 0,
    incAmount: 0,
    decAmount: 0,
    dailyAmount: 0
  }

  // ... (rest of your properties: balance getter/setter, clickTimer, ledger, etc.)
  get balance(): number {
    return this.balanceData.balance;
  }
  set balance(value: number) {
    this.balanceData.balance = value;
  }
  ALLOWED_IDLE_TIME = 3500;
  runningTotal = 0;
  // Assuming EventTimer class is defined elsewhere or below
  clickTimer: EventTimer = new EventTimer(this.ALLOWED_IDLE_TIME, () => this.updateBalance(this.runningTotal));
  addDailyTimer: number = -1;
  ledger = new LedgerBook();


  constructor() {
    // ... (your existing constructor logic) ...
    console.log('loading saaved data');
    this.ledger.loadHistory();
    this.loadBalance(); // Sets initial balanceData, including lastUpdated
    this.statusControl.addStatus('Loaded balance from saved file');

    // Initial check and potential update after loading
    this.updateDate();

    // Schedule the midnight check (keep your existing logic here)
    this.scheduleMidnightCheck();

    console.log('finished loading');
    // updateBalance() call here might be redundant if updateDate already handled it
    // this.updateBalance(); // Consider if this is needed after updateDate runs
  }

  // --- Helper function moved out of updateDate ---
  private _calendarDaysElapsed(date1: Date, date2: Date): number {
    // Normalize dates to midnight local time
    const d1 = new Date(date1.toDateString()).valueOf();
    const d2 = new Date(date2.toDateString()).valueOf();
    const diff = Math.abs(d2 - d1);
    const days = Math.floor(diff / MILLISECONDS_PER_DAY);
    return days;
  }

  // --- Method to schedule the midnight check (extracted from constructor for clarity) ---
  private scheduleMidnightCheck() {
      const now = new Date();
      // Calculate time until the *next* midnight + a small buffer (e.g., 30 seconds)
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 30, 0); // Set to 00:00:30 of the next day

      const timeTillMidnightEvent = tomorrow.getTime() - now.getTime();

      console.log(`Scheduling next midnight check in ${Math.round(timeTillMidnightEvent / 1000 / 60)} minutes`);

      // Clear any existing timer before setting a new one
      if (this.addDailyTimer !== -1) {
          clearTimeout(this.addDailyTimer);
      }

      this.addDailyTimer = setTimeout(() => {
          this.statusControl.addPriorityStatus('----------MIDNIGHT EVENT!-------------');
          console.log('---------------------------MIDNIGHT HAPPENED ----------------------------------------------');
          this.updateDate(); // Run the daily allowance check
          this.scheduleMidnightCheck(); // Reschedule for the *next* midnight
      }, timeTillMidnightEvent);
  }


  // ... (increment, decrement, updateBalance, saveBalance, loadBalance methods) ...

  increment() {
    this.clickTimer.onClick('clicked +');
    this.runningTotal += this.balanceData.incAmount;
    this.statusControl.addPriorityStatus("Adding: " + this.runningTotal);
  }

  decrement() {
    this.clickTimer.onClick('clicked -');
    // Note: decAmount is likely negative, so += works for subtraction
    this.runningTotal += this.balanceData.decAmount;
    this.statusControl.addPriorityStatus("Subtracting: " + this.runningTotal);
  }

  updateBalance(entryDetail: Transaction | number = this.runningTotal) {
    let entry: Transaction;
    let amountToAdd: number;

    if (typeof entryDetail === 'number') {
      amountToAdd = entryDetail;
      // Use current time for generic number updates
      entry = { date: Date.now(), tags: ['manual', 'update'], amount: amountToAdd };
    } else {
      // Use the entry's details
      entry = entryDetail;
      amountToAdd = entry.amount;
    }

    // Only proceed if there's an actual amount change
    if (amountToAdd !== 0) {
        console.log('Updating balance by: ' + amountToAdd);
        this.balance += amountToAdd; // Use the setter

        // Add specific transaction details if available, otherwise use generic tags
        this.ledger.addEntry(entry);
        this.ledger.saveHistory(); // Save history after adding entry

        // Save balance triggers status update and saves 'data' to localStorage
        this.saveBalance(entry.tags.join(' '));

        // Reset runningTotal *after* everything is processed
        this.runningTotal = 0;
        this.statusControl.addStatus("Transaction Recorded. Amount: " + amountToAdd);

    } else {
        console.log('UpdateBalance called with zero amount. No changes made.');
        // Reset runningTotal even if amount is 0, as the timer callback expects it
        this.runningTotal = 0;
    }
  }

  saveBalance(msg: string = '') {
    console.log('BeanService saveBalance');
    // Update timestamp right before saving
    this.balanceData.lastUpdated = Date.now();
    const data = JSON.stringify(this.balanceData);
    console.log('Saving data:', data);
    window.localStorage.setItem('data', data);
    // Use a clearer save message
    this.statusControl.addStatus(`Saved balance: ${this.balance}. Reason: ${msg || 'N/A'}`);
  }

  loadBalance() {
    console.log('BeanService loadBalance');
    const defaultValues = {
      balance: 0,
      lastUpdated: Date.now(), // Default to now if no saved data
      incAmount: 100,
      decAmount: -25,
      dailyAmount: 300
    };

    const savedData = window.localStorage.getItem('data');
    if (savedData) {
      try {
        this.balanceData = JSON.parse(savedData);
        // Basic validation (optional but recommended)
        if (typeof this.balanceData.balance !== 'number' || typeof this.balanceData.lastUpdated !== 'number') {
            console.warn("Loaded data format seems incorrect, falling back to defaults.");
            this.balanceData = defaultValues;
        } else {
             this.statusControl.addStatus('Loaded balance from storage: ' + this.balanceData.balance);
        }
      } catch (e) {
         console.error("Failed to parse saved data, using defaults.", e);
         this.balanceData = defaultValues;
         this.statusControl.addStatus('Error loading data, using defaults.');
      }
    } else {
      console.log('No saved data found, using default values.');
      this.balanceData = defaultValues;
      this.statusControl.addStatus('No saved data, using default value of ' + defaultValues.balance);
      // Save the initial default state
      this.saveBalance("Initialized with default values");
    }
    console.log('Loaded balanceData: ', this.balanceData);
  }


  /**
   * Checks elapsed days since last update and applies daily allowances if needed.
   * Also handles data backup if more than one day has passed.
   */
  updateDate() {
    console.log('BeanService: Checking for daily allowances...');
    const today = new Date();
    // Ensure lastUpdated is a valid date object, default to now if necessary
    const loadedDate = new Date(this.balanceData.lastUpdated || Date.now());
    this.statusControl.addStatus('Last known update: ' + loadedDate.toLocaleString());

    const deltaDays = this._calendarDaysElapsed(today, loadedDate);
    console.log(`Calendar days elapsed since last update: ${deltaDays}`);

    // --- Backup Logic ---
    // Create backup if more than 1 full day has passed (e.g., last update Mon, check Wed)
    if (deltaDays > 1) {
      console.log(`More than one day (${deltaDays}) passed, creating backup.`);
      // Consider adding error handling for localStorage operations
      try {
          const currentData = window.localStorage.getItem('data');
          if (currentData) {
              window.localStorage.setItem('backup', currentData);
              this.statusControl.addStatus(`Backed up data from ${loadedDate.toLocaleDateString()}`);
          } else {
              console.warn("No 'data' found in localStorage to backup.");
          }
      } catch (e) {
          console.error("Failed to create backup:", e);
          this.statusControl.addStatus('Error creating backup!');
      }
    }

    // --- Allowance Logic ---
    // Apply allowance if 1 or more full days have passed
    if (deltaDays >= 1) {
      console.log(`Applying allowance for ${deltaDays} day(s).`);
      // Use a local variable for clarity
      const totalAllowance = deltaDays * this.balanceData.dailyAmount;

      // Don't update lastUpdated here; saveBalance will handle it.

      const entry: Transaction = {
        date: Date.now(), // Use current time for the transaction date
        tags: [`${deltaDays}d`, 'daily', 'allowance'], // More descriptive tags
        amount: totalAllowance
      };

      // updateBalance handles adding to balance, ledger, and saving
      this.updateBalance(entry);

      // Status message now added within updateBalance/saveBalance for consistency
      // this.statusControl.addStatus(`Added ${totalAllowance} allowance for ${deltaDays} days`);

    } else {
      console.log('No full calendar days elapsed since last update. No allowance added.');
      // Optional: Add a status message if desired, but might be noisy
      // this.statusControl.addStatus('No daily allowance needed today.');
    }
  }
}

// Assuming EventTimer class definition is here or imported
class EventTimer {
  recentClick = false;
  recentThreshold = 14000;
  activeTimer: any = 0; // Use 'any' or 'number | NodeJS.Timeout' for broader compatibility
  callBack = () => { };

  constructor(maxIdleTime: number, actionOnIdle: () => void) {
    this.recentThreshold = maxIdleTime;
    this.callBack = actionOnIdle;
  }

  onClick(debugMsg: string) {
    console.log(debugMsg);
    // Simplified logic: always clear existing timer and start a new one on click
    clearTimeout(this.activeTimer);
    this.startTimer();
  }

  startTimer() {
    console.log(`Starting/resetting action timer for ${this.recentThreshold}ms`);
    this.recentClick = true; // Mark that a click sequence is active
    this.activeTimer = setTimeout(() => {
      console.log('Timer finished. Executing callback.');
      this.recentClick = false; // Reset click sequence flag
      // It's crucial that the callback (updateBalance) resets any accumulated state (like runningTotal)
      this.callBack();
      // No need to clear timer here, it has already fired.
    }, this.recentThreshold);
  }
}
