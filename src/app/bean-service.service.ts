import { inject, Injectable } from '@angular/core';
import { StatusControlService } from './status-control.service';


interface Transaction {
  date: number,
  tags: Array<string>,
  amount: number,
}

@Injectable({
  providedIn: 'root',
})
export class BeanServiceService {

  private statusControl = inject(StatusControlService

  )
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
  set balance(value: number) {
    this.balanceData.balance = value;
    // hmm, using angular now. Can't alter DOM directly. Must use interpolation
    // this.balanceTag.innerText = this.balance;
  }

  // A flag determining whether a button was recently clicked. This is used to allow multiple clicks to be registered and agglomerated as one total transaction

  // timeBeforeNewTransaction = 3500; Doubleclick time
  // VERY fine tuning: the milliseconds to elapse before allowing a click to be registered to a new transaction
  ALLOWED_IDLE_TIME = 4000;
  runningTotal = 0;
  clickTimer: number = 0; // id of setTimeout
  
  
  // TODO: implement history. Guess yet another service? Jip.
  ledger = new LedgerBook();


  // balanceTag = document.querySelector('#balnace');

  constructor() {
    // Here is the actual constructor. Real version should have no setTimeout
    
    console.log('loading saaved data');
    this.loadBalance();
    // TODO: implement loadHistory method
    // this.ledger.loadHistory();
    console.log(this.ledger.ledgerData);


    setTimeout(() => {
      console.log('finished loading');
      this.updateDate();
      this.updateBalance();
      this.statusControl.setStatus('Updated balance from saved file');
      this.saveBalance("Loaded balance from saved file and applied daily allowances");
      // this.ledger.saveHistory();
    }, 5000);
  }

  increment() {
    
    console.log(this);
    console.log('BeanService increment');
    // console.log(this.balanceData);
    this.runningTotal += this.balanceData.incAmount;
    this.statusControl.setStatus("Adding: " + this.runningTotal);
  }

  decrement() {
    console.log('BeanService decrement');
    // this.balance -= this.balanceData.decAmount;
    console.log(this.balanceData.decAmount);
    this.runningTotal += this.balanceData.decAmount;
    this.statusControl.setStatus("Subtracting: " + this.runningTotal);
  }


    // Uses runningTotal to update balance.
  // TODO: should be a method of LedgerBook. Should also have a parameter for amount.
  // Only function of this function is to update the balance display
  updateBalance(amount = this.runningTotal) {
    this.balance += amount;
    // debugAction.innerText = 'Updated balance by: ' + this.runningTotal;
    this.statusControl.setStatus("Transaction Total: " + this.runningTotal);
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


    this.statusControl.setStatus('Balance after transaction: ' + this.balance.toString() + '---' + msg);
    
    // lastDate.textContent = new Date(this.balanceData.date).toLocaleString();
  }

  loadBalance() {
    console.log('BeanService loadBalance');
    const defaultValues = {
      balance: 0,
      date: new Date(),
      incAmount: 100,
      decAmount: -25,
      dailyAmount: 250
    };
    window.localStorage.removeItem('data');
    const savedData = window.localStorage.getItem('data');
    console.log('Data in lcoalstorage');
    console.log(savedData);
    if (savedData) {
      this.balanceData = JSON.parse(savedData);
      this.statusControl.setStatus('Loaded balance: ' + this.balanceData.balance);
    }
    else {
      console.log('No data in localStorage')
      this.statusControl.setStatus('No saved data, using defualts');
      this.balanceData = defaultValues;
    };
    this.balance = this.balanceData.balance;
    console.log('Loaded: ', this.balanceData);

    this.statusControl.setStatus('Loaded balance: '+ this.balance);
    // lastDate.textContent = new Date(this.balanceData.date).toLocaleString();
  }


  updateDate() {
    console.log('BeanService pay daily allowances');
    // no, only update date when saving
    // const today = new Date();
    const today = new Date();
    const loadedDate = new Date(this.balanceData.date);

    // get time difference between now and last saved in milliseconds, hours, days.
    const deltaTime = today.getTime() - loadedDate.getTime();
    const deltaHours = Math.floor(deltaTime / 1000 / 60 / 60);
    const deltaDays = Math.floor(deltaTime / 1000 / 60 / 60 / 24);

    console.log('Calculations:');
    console.log(deltaTime + ' - ' + deltaHours + ' - ' + deltaDays);

    // SAVE backup if more than 24 hours passed:
    if (deltaHours >= 24) {
      window.localStorage.setItem('backup', window.localStorage.getItem('data') ?? "{}");
      console.log('backed up data');
      this.statusControl.setStatus('Backed up data');
    }

    // use already calculated days ellapsed to get new balance
    // Math.floor - do not want fractional salaries

    const totalIncome = deltaDays * this.balanceData.dailyAmount;
    console.log(`added income to bal. Total: ${totalIncome} - for ${deltaDays} days ellapsed`);
    this.balance = this.balance + totalIncome;
    this.balanceData.date = today;
    this.balanceData.balance = this.balance;

    this.statusControl.setStatus(`Added ${totalIncome} to balance`);
    // debugAction.textContent = `Updated balance with ${totalIncome} for ${deltaDays} days`;
    // lastDate.textContent = new Date(this.balanceData.date).toDateString();

    this.saveBalance('daily allowances');
    if (deltaDays > 0) {
      this.updateBalance(this.balance);
      const entry: Transaction = { date: Date.now(), tags: ['daily', 'allowance', 'paid'], amount: totalIncome };
      this.ledger.addEntry(entry)
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
    this.ledgerData.push(entry);
    
  }
}

class eventTimer {
  recentClick = false;
  recentThreshold = 14000;
  activeTimer;
  callBack;

  constructor(threshold, runAfterTimeout) {
      this.recentThreshold = threshold;
      this.callBack = runAfterTimeout;
  }

  onClick(debugMsg) {
      console.log(debugMsg);
      const recentClick = this.recentClick;
      console.log('click noted. Currently have: ' + recentClick);
      console.log(this.activeTimer);

      if (recentClick == false) {
          this.startTimer();
          return (recentClick);
      }

      if (recentClick == true) {
          clearTimeout(this.activeTimer);
          this.startTimer();
          return (recentClick);
      }

      console.log("event happened. Starting or restarting timer");

  }

  startTimer() {
      console.log('Starting timer');
      this.recentClick = true;
      this.activeTimer = setTimeout(() => {
          console.log('class timer is done');
          this.recentClick = false;
          this.callBack();
      }, this.recentThreshold);
  }
}
