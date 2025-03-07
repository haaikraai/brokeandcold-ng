import { inject, Injectable } from '@angular/core';
import { StatusControlService } from './status-control.service';
import { Transaction } from './transaction';
import { LedgerBook } from './LedgerBook';

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
  ALLOWED_IDLE_TIME = 3500;
  runningTotal = 0;
  clickTimer: EventTimer = new EventTimer(this.ALLOWED_IDLE_TIME, () => this.updateBalance(this.runningTotal));

  addDailyTimer: number = -1;

  // TODO: implement history. Guess yet another service? Jip.
  ledger = new LedgerBook();

  // balanceTag = document.querySelector('#balnace');

  constructor() {
    // moved from onInit. Services can't do oninit it seems to be
    console.log('Can services even use oninit??')
    // Here is the actual constructor. Real version should have no setTimeout

    // DEBUGGING: uncomment to clear storage and start afresh
    // window.localStorage.removeItem('data');
    // window.localStorage.removeItem('history')


    console.log('loading saaved data');
    this.ledger.loadHistory();
    this.loadBalance();
    this.statusControl.addStatus('Updated balance from saved file');

    // DEBUGGING STUFF: uncomment to create midnight event soon
    // const now = new Date('2025-02-07 23:56:12');
    const now = new Date();
    //  add a 30 seconds to make sure it runs after midnight. Otherwise updateDate won't recognise the new day
    const timeTillMidnight = 24 * 60 * 60 - (now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds()) + 30;

    this.addDailyTimer = setTimeout(() => {
      this.balanceData.date = now;
      this.statusControl.addPriorityStatus('----------MIDNIGHT EVENT!-------------');
      console.log('---------------------------MIDNIGHT HAPPENED ----------------------------------------------');
      this.updateDate();
      clearTimeout(this.addDailyTimer);
    }, timeTillMidnight * 1000);
    console.log('Ticking timer for till midnight: ' + timeTillMidnight/60 + ' minutes');


    console.log('finished loading');
    this.updateDate();
    this.updateBalance();
    // this.saveBalance("Loaded balance from saved file and applied daily allowances");
    // this.ledger.saveHistory();
  }

  increment() {
    this.clickTimer.onClick('clicked +');
    // console.log(this.balanceData);
    this.runningTotal += this.balanceData.incAmount;
    this.statusControl.addPriorityStatus("Adding: " + this.runningTotal);

  }

  decrement() {
    // this.balance -= this.balanceData.decAmount;
    this.clickTimer.onClick('clicked -');
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
      entry = { date: new Date().getTime(), tags: ['unknown', 'source'], amount: entryDetail };
    } else {
      entry = (<Transaction>entryDetail)
      this.balance += entry.amount;
    }

    // debugAction.innerText = 'Updated balance by: ' + this.runningTotal;

    if (entry.amount !== 0) {
      console.log('Updated balance by: ' + this.runningTotal);
      this.statusControl.addStatus("Transaction Total: " + this.runningTotal);

      this.ledger.addEntry(entry);
      this.ledger.saveHistory();
      this.saveBalance(entry.tags.join(' '));
      this.runningTotal = 0;
    }
  }

  saveBalance(msg: string) {
    console.log('BeanService saveBalance');
    console.log('Saving: ', this.balance);
    // THis is automatically done with balance get/set
    // this.balanceData.balance = this.balance;
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
      date: new Date('2025-02-09'),
      incAmount: 100,
      decAmount: -25,
      dailyAmount: 11
    };
    // THIS LINE IS A FLAG TO PREVENT LOADING DATA AND USE DEFAULT INSTEAD

    const savedData = window.localStorage.getItem('data');
    if (savedData) {
      this.balanceData = JSON.parse(savedData);
      this.statusControl.addStatus('Loaded balance from storage: ' + this.balanceData.balance);
    }
    else {
      console.log('No data in localStorage\nAll found was:')
      console.log(savedData);
      this.statusControl.addStatus('No saved data, using defualt value of ' + defaultValues.balance);
      this.balanceData = defaultValues;
    };
    // get/set should cover this.
    // this.balance = this.balanceData.balance;
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

    // Check only if a new day happened, not if 24 hours passed. If so, then do the math. Could also have used modulus
    const newDay = (today.toDateString() !== loadedDate.toDateString())
    // calculate days that crossed midnight but less than 24 hours, hence the +1
    const deltaDays = newDay ? Math.floor(deltaTime / 1000 / 60 / 60 / 24) + Number(newDay) : 0;


    // deltaDays += Number(newDay).valueOf();

    console.log('Calculations:');
    console.log(deltaTime + ' = hours: ' + deltaHours + '; days: ' + deltaDays);

    // SAVE backup if more than 24 hours passed:
    // if (deltaHours >= 24) {
    if (false) {
      
      // fuck me sweetly b'tween thee ass cheecks - I think this messed up loading here causes the double entry values. Maybe not. But balance doubles that is true.
      // TODO here hi how does balance go to 2000? and then anoth nah wait....
      window.localStorage.setItem('backup', window.localStorage.getItem('data') ?? "{}");
      this.statusControl.addStatus('Backed up data');
    }

    // use already calculated days ellapsed to get new balance
    // Math.floor - do not want fractional salaries

    if (newDay) {         //------> waited? good. cause here it gets 2000

      this.runningTotal = deltaDays * this.balanceData.dailyAmount;
      // this.statusControl.addStatus(`added income to bal. Total: ${this.runningTotal} - for ${deltaDays} days ellapsed`);
      // balancedata.balance has get/set with balance
      // this.balanceData.balance = this.balance + this.runningTotal;
      this.balanceData.date = today;
      // don't update ballance here. It happens in updateBalance

      const entry: Transaction = { date: Date.now(), tags: [`${deltaDays}`, 'daily', 'paid'], amount: this.runningTotal };
      this.updateBalance(entry);

      this.statusControl.addStatus(`Added ${this.runningTotal} to balance for ${deltaDays} days ellapsed`);
      // debugAction.textContent = `Updated balance with ${totalIncome} for ${deltaDays} days`;
      // lastDate.textContent = new Date(this.balanceData.date).toDateString();

      // this.saveBalance('${this.runningTotal} daily allowances for ${deltaDays} days');
      // done in updatebalance
      // this.ledger.addEntry(entry)
      // this.saveBalance('daily allowances');
      // this.statusControl.addStatus('Added entry: ' + JSON.stringify(entry));
    }
    else {
      console.log('no money today');
      this.statusControl.addStatus('No money today, ey ey');
    }
  }

}


class EventTimer {
  recentClick = false;
  recentThreshold = 14000;
  activeTimer = 0;
  callBack = () => { };

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
