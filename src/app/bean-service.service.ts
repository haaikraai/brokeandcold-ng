import { inject, Injectable } from '@angular/core';
import { StatusControlService } from './status-control.service';
import { Transaction } from './transaction';

@Injectable({
  providedIn: 'root',
})
export class BeanServiceService {

  private statusControl = inject(StatusControlService)

  balanceData = {
    balance: 0,
    date: new Date(),
    incAmount: 0,
    decAmount: 0,
    dailyAmount: 0
  }

  // balanceData = null;

  /**
   * @type {number}
   * @default 0
   * @private
   * @description current balance
   */
  get balance(): number { 
    return this.balanceData.balance; 
  }

  // will this automatically update the component UI or should I use a signal?
  set balance(value: number) {
    this.balanceData.balance = value;
  }

  // timeBeforeNewTransaction = 3500; Doubleclick time
  // VERY fine tuning: the milliseconds to elapse before allowing a click to be registered to a new transaction
  ALLOWED_IDLE_TIME = 3000;
  runningTotal = 0;
  clickTimer: EventTimer = new EventTimer(this.ALLOWED_IDLE_TIME, () => this.updateBalance(this.runningTotal));
  
  
  // TODO: implement history. Guess yet another service? Jip.
  ledger = new LedgerBook();


  // balanceTag = document.querySelector('#balnace');

  constructor() {
    // Here is the actual constructor. Real version should have no setTimeout
    
    console.log('loading saaved data');
    this.loadBalance();
    this.statusControl.addStatus('Updated balance from saved file');
    // TODO: implement loadHistory method
    // this.ledger.loadHistory();
    console.log(this.ledger.ledgerData);


    setTimeout(() => {
      console.log('finished loading');
      this.updateDate();
      this.updateBalance();
      this.statusControl.addStatus('Calculated daily allowances');
      this.saveBalance("Loaded balance from saved file and applied daily allowances");
      // this.ledger.saveHistory();
    }, 5000);
  }

  increment() {
    console.log(this);
    console.log('BeanService increment');
    this.clickTimer.onClick('clicked +');
    // console.log(this.balanceData);
    this.runningTotal += this.balanceData.incAmount;
    this.statusControl.addPriorityStatus("Adding: " + this.runningTotal);
  }

  decrement() {
    console.log('BeanService decrement');
    // this.balance -= this.balanceData.decAmount;
    this.clickTimer.onClick('clicked -');
    console.log(this.balanceData.decAmount);
    this.runningTotal += this.balanceData.decAmount;
    this.statusControl.addPriorityStatus("Subtracting: " + this.runningTotal);
  }


  /*
  @param {Transaction | Number} entry
  @description updates the balance by adding the amount of the passed transaction. A number is just straight added to the balance.

  In general a transaction is prefered over a number to be logged to the ledger. A number on its own is just added to the balance and there for developer convenience. Even changing an incorrect balance due to a typo should ideally have a transaction to log the reasons for the change.
  */
  updateBalance(entryDetail: Transaction | Number = this.runningTotal) {
    let entry: Transaction;
    if (typeof entryDetail === 'number') {
      this.balance += entryDetail;
      entry = {date: new Date().getTime(), tags: ['unknown','source'], amount: entryDetail};
    } else {
      entry = (<Transaction>entryDetail)
      this.balance += entry.amount;
    }

    // debugAction.innerText = 'Updated balance by: ' + this.runningTotal;
    console.log('Updated balance by: ' + this.runningTotal);
    this.statusControl.addPriorityStatus("Transaction Total: " + this.runningTotal);
    
  if (entry.amount != 0) {
    this.ledger.addEntry(entry);
    this.runningTotal = 0;
  }
  }

  saveBalance(msg: string) {
    console.log('BeanService saveBalance');
    console.log('Saving: ', this.balance);
    this.balanceData.balance = this.balance;
    this.balanceData.date = new Date();
    const data = JSON.stringify(this.balanceData);
    console.log(data);
    // window.localStorage.setItem('balance', this.balance);
    window.localStorage.setItem('data', data);
    this.statusControl.addStatus('Saved balance: ' + this.balance.toString() + ' -for reasons- ' + msg);
    
    // lastDate.textContent = new Date(this.balanceData.date).toLocaleString();
  }

  loadBalance() {
    console.log('BeanService loadBalance');
    const defaultValues = {
      balance: 0,
      date: new Date('2025-01-07'),
      incAmount: 100,
      decAmount: -25,
      dailyAmount: 250
    };
    // THIS LINE IS A FLAG TO PREVENT LOADING DATA AND USE DEFAULT INSTEAD
    window.localStorage.removeItem('data');
    const savedData = window.localStorage.getItem('data');
    console.log('Data in lcoalstorage');
    console.log(savedData);
    if (savedData) {
      this.balanceData = JSON.parse(savedData);
      this.statusControl.addStatus('Loaded balance from storage: ' + this.balanceData.balance);
    }
    else {
      console.log('No data in localStorage')
      this.statusControl.addStatus('No saved data, using defualt value of ' + defaultValues.balance);
      this.balanceData = defaultValues;
    };
    this.balance = this.balanceData.balance;
    console.log('Loaded: ', this.balanceData);

    // this.statusControl.addStatus('Loaded balance: '+ this.balance);
    // lastDate.textContent = new Date(this.balanceData.date).toLocaleString();
  }


  updateDate() {
    
    console.log('BeanService pay daily allowances');
    // no, only update date when saving
    // const today = new Date();
    const today = new Date();
    const loadedDate = new Date(this.balanceData.date);
    this.statusControl.addStatus('Last saved date: ' + loadedDate.toLocaleString());

    // get time difference between now and last saved in milliseconds, hours, days.
    const deltaTime = today.getTime() - loadedDate.getTime();
    const deltaHours = Math.floor(deltaTime / 1000 / 60 / 60);
    const deltaDays = Math.floor(deltaTime / 1000 / 60 / 60 / 24);

    console.log('Calculations:');
    console.log(deltaTime + ' = hours: ' + deltaHours + '; days: ' + deltaDays);

    // SAVE backup if more than 24 hours passed:
    if (deltaHours >= 24) {
      window.localStorage.setItem('backup', window.localStorage.getItem('data') ?? "{}");
      console.log('backed up data');
      this.statusControl.addStatus('Backed up data');
    }

    // use already calculated days ellapsed to get new balance
    // Math.floor - do not want fractional salaries

    this.runningTotal = deltaDays * this.balanceData.dailyAmount;
    console.log(`added income to bal. Total: ${this.runningTotal} - for ${deltaDays} days ellapsed`);
    this.balance = this.balance + this.runningTotal;
    this.balanceData.date = today;
    this.balanceData.balance = this.balance;

    this.statusControl.addStatus(`Added ${this.runningTotal} to balance for ${deltaDays} days ellapsed`);
    // debugAction.textContent = `Updated balance with ${totalIncome} for ${deltaDays} days`;
    // lastDate.textContent = new Date(this.balanceData.date).toDateString();

    this.saveBalance('daily allowances');
    if (deltaDays > 0) {
      
      const entry: Transaction = { date: Date.now(), tags: ['daily', 'allowance', 'paid'], amount: this.runningTotal };
      this.updateBalance(entry);
      // this.ledger.addEntry(entry)
      this.saveBalance('daily allowances');
      this.statusControl.addStatus('Added entry: ' + JSON.stringify(entry));
    }
  }

}


// OLD STUFF:
// Note man, a LOT of this Vanilla JS is just to manage the UI updates. Unnecessary for angular.

/*
  testInstance() {
    console.log('Testing beanService');
    console.log(this.balanceData);
  }

  /*
  Compares last saved date to now. Adds the dailyAmount * (difference in days) to the balance.
  ADDITIONALLY: if the date is a new day, it saves an extra copy to "backup"
  


}

*/

class LedgerBook {
  
  ledgerData: Transaction[] = [];
  addEntry(entry: Transaction) {
    console.log('ADDDING AN ENTRY!!!!');
    this.ledgerData.push(entry);
  }
}

class EventTimer {
  recentClick = false;
  recentThreshold = 14000;
  activeTimer = 0;
  callBack = () => {};

  constructor(maxIdleTime: number, actionOnIdle: () => void) {
      this.recentThreshold = maxIdleTime;
      this.callBack = actionOnIdle;
  }

  onClick(debugMsg: string) {
      console.log(debugMsg);
      
      console.log('click noted. Currently have: ' + this.recentClick);
      console.log(this.activeTimer);

      if (this.recentClick == false) {
          this.startTimer();
          return
      }

      if (this.recentClick == true) {
          clearTimeout(this.activeTimer);
          this.startTimer();
          return
      }

      console.log("event happened. Starting or restarting timer");

  }

  startTimer() {
      console.log('Starting timer');
      this.recentClick = true;
      this.activeTimer = setTimeout(() => {
          console.log('click timer is done after ' + this.recentThreshold + 'ms');
          this.recentClick = false;
          clearTimeout(this.activeTimer);
          this.callBack();
      }, this.recentThreshold);
  }
}
