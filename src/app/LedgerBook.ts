import { OmniscientTransaction, Transaction } from './transaction';

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
export class LedgerBook {

  maxRows = 10;
  ledgerData: OmniscientTransaction[] = [];

  addEntry(entry: Transaction) {
    console.log('ADDDING AN ENTRY!!!!');
    const realEntry: OmniscientTransaction = {
      id: this.ledgerData.length + 1,
      ...entry
    };
    this.ledgerData.push(realEntry);
  }

  private _displayedLedger: OmniscientTransaction[] = [];
    
  get displayedLedger(): OmniscientTransaction[] {
    console.log(this.ledgerData);
    this._displayedLedger = this.ledgerData.slice(0, Math.min(this.maxRows, this.ledgerData.length));
    return this._displayedLedger;
  }
  
  set displayedLedger(value: OmniscientTransaction[]) {
    this._displayedLedger = [...value];
  }
  

  /**
   * DEPRECATED: This method fits better in the calling component since it is for more niche cases.
   * Updates an existing item in the ledger with new data.
   *
   * This function finds an item in the ledger based on its ID, replaces it with the provided
   * `entry`, and then saves the updated ledger to local storage. It also calculates and returns
   * the difference in the 'amount' between the old and new entries.
   *
   * @param id - The ID of the item to update.
   * @param entry - The new data for the item.
   * @returns The difference in 'amount' between the old and new entries. This can be useful to change the summed total balance as well
   */
  updateItem(id: number, entry: Transaction): number {
    const realEntry: OmniscientTransaction = {
      id: id,
      ...entry
    };
    const index = this.ledgerData.findIndex(item => item.id == id);
    const amountChange = realEntry.amount - this.ledgerData[index].amount;

    this.ledgerData[index] = JSON.parse(JSON.stringify(realEntry)) as OmniscientTransaction; //realEntry;
    this.saveHistory();

    return amountChange
  }


  getItemId(id: number): OmniscientTransaction {
    const trx = <OmniscientTransaction>this.ledgerData.find(item => item.id == id);

    if (id == 0) {
      const notrx: OmniscientTransaction = {
        amount: -1,
        date: 0,
        tags: ['element','zero'],
        id: 0
      };
      return notrx;

    } else if (trx) {
      return trx;

    } else if(id > this.ledgerData.length) {
      const notrx: OmniscientTransaction = {
        amount: -1,
        date: 0,
        tags: ['out','of','range'],
        id: 0
      };
      return notrx;
    } else {
      return trx;
    }

    // filter(item => item.id == id)[0];
  }

  saveHistory() {
    window.localStorage.setItem('history', JSON.stringify(this.ledgerData));
  }

  loadHistory() {
    const loadedHistory = window.localStorage.getItem('history');
    if (loadedHistory) this.ledgerData = JSON.parse(loadedHistory);
  }
}
