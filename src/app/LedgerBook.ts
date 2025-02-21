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

  ledgerData: OmniscientTransaction[] = [];

  addEntry(entry: Transaction) {
    console.log('ADDDING AN ENTRY!!!!');
    const realEntry: OmniscientTransaction = {
      id: this.ledgerData.length + 1,
      ...entry
    };
    this.ledgerData.push(realEntry);
  }

  updateItem(id: number, entry: Transaction) {
    const realEntry: OmniscientTransaction = {
      id: id,
      ...entry
    };
    const index = this.ledgerData.findIndex(item => item.id == id);
    this.ledgerData[index] = JSON.parse(JSON.stringify(realEntry)) as OmniscientTransaction; //realEntry;
  }


  getItemId(id: number) {
    return this.ledgerData.find(item => item.id == id);


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
