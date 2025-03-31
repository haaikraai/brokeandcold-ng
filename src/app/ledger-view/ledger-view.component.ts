
import { Component, inject, input, signal, Type, OnChanges } from '@angular/core';
import { NgIf } from '@angular/common';
import { BeanServiceService } from '../bean-service.service';
import { OmniscientTransaction, Transaction } from '../transaction';
import { AmodalComponent } from '../amodal/amodal.component';
import { EditTransactionComponent } from "../edit-transaction/edit-transaction.component";
import { DatePipe, JsonPipe, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-ledger-view',
  imports: [EditTransactionComponent, NgIf, DatePipe],
  templateUrl: './ledger-view.component.html',
  styleUrl: './ledger-view.component.css',
})
export class LedgerViewComponent {
  
  /* Just the rendering component.
  It accepts an array of transactions, and displays them in a table.
  Like look, in a gigantic super strict app I would make each row a component, becuase the row has functionality - specifically to handle the editing. But I'm just gonna jam it all in here.
  */

  // To think. Should I use data from beanService or input own data?
  // Use from beanService - it is there already after all, less chance of errors, less code, less memory. Yeah.
  
  private beanService = inject(BeanServiceService);
  // private ledgerData: OmniscientTransaction[] | null = null;
  shortLedger = signal<OmniscientTransaction[]>(this.beanService.ledger.displayedLedger);
  ledgerRef = this.beanService.ledger.ledgerData;
  
  
  // private route = inject
  // private comp = NgComponentOutlet
  editingModal = false;
  // protected editComponent: Type<AmodalComponent> | Type<EditTransactionComponent> | null = EditTransactionComponent;
  
  
  // shortLedger = () => {
  //   return this.beanService.ledger.ledgerData.slice(0, Math.min(8, this.beanService.ledger.ledgerData.length)).reverse()
  // }
  // editModal: ElementRef<HTMLElement> = ViewChild('#editfo', {read: ElementRef, static: false})
  

  


  // TODO: Shouldn't use signals as inputs, just bad taste. See: https://www.youtube.com/watch?v=U8YXaWwyd9k
  // Summary: Just do the conversion to signal in the child component. This is what input signals do
  maxRows = input<number>(8);
  currentEntry: OmniscientTransaction = ({ id: 0, date: Date.now(), tags: ['initial','tags'], amount: 0 });

  constructor() {
    // put initialization in constructor so that fresh data is obtained each time.
  }

  ngOnInit() {
    // this.ledgerData = this.beanService.ledger.ledgerData;
    // this.currentEntry.tags.join()

  }

  

  editEntry(entryId: number) {
    this.editingModal = true;
    this.currentEntry = this.beanService.ledger.getItemId(entryId) as OmniscientTransaction;
    const currentVersion = this.shortLedger();
    // this.shortLedger.update((ledger) => {
    //   currentVersion[ledger.findIndex((ledger) => {ledger.id === entryId})] = 
    // })
  }

  


  onSave(newEntry: OmniscientTransaction) {
    const originalEntry: OmniscientTransaction = JSON.parse(JSON.stringify(this.currentEntry));
    let updatedEntry: OmniscientTransaction = JSON.parse(JSON.stringify(newEntry));
    this.editingModal = false;
    
    if (updatedEntry && originalEntry) {  
      // This varialbe isn't really used anymore. Should delete it sometime.
      this.currentEntry = <OmniscientTransaction>newEntry;
      
      console.log('Received new entry from form and think I changed it. New values are:')
      console.log(updatedEntry);

      // Check for balance change, then enter this into the books

      if (updatedEntry.amount != originalEntry.amount) {
        const amountDiff = updatedEntry.amount - originalEntry.amount;
        
        const updatedTransaction: Transaction = {
          date: Date.now(),
          tags: ['Cooked','the','books'],
          amount: amountDiff
        };
        
        this.beanService.updateBalance(updatedTransaction);
      }

      // Check for date change then recalculate the daily amounts paid.

      // updateItem(id: number, entry: Transaction): number {
      if (updatedEntry.date != originalEntry.date) {
        if (String.length > 0) {
          console.log(`Converting form date string: ${newEntry.date}`);
          updatedEntry.date = parseInt(<string>updatedEntry.date);
          console.log(`To a epoch number ${updatedEntry.date}`);
        } else {
          updatedEntry.date = -1;
        }
        this.beanService.balanceData.lastUpdated = updatedEntry.date;

        updatedEntry = {
          id: updatedEntry.id,
          date: updatedEntry.date,
          amount: updatedEntry.amount,
          tags: updatedEntry.tags
        }

      }
      
      const index = this.beanService.ledger.ledgerData.findIndex(item => item.id == this.currentEntry.id);
      
  
      this.beanService.ledger.ledgerData[index] = JSON.parse(JSON.stringify(updatedEntry)) as OmniscientTransaction; //realEntry;
      this.beanService.ledger.saveHistory();
    }
      
      
      // this.beanService.balance += changedTransaction.amount;
      this.beanService.updateBalance(updatedEntry);
      this.beanService.saveBalance();
    }

  //   this.ledgerRef = this.beanService.ledger.ledgerData;
  //   this.shortLedger.set(this.beanService.ledger.displayedLedger);

  //   this.beanService.saveBalance();
  //   console.log('Post save values:');
  //   console.log(this.ledgerRef);
  //   console.log(this.shortLedger());
  // }

  /*
    Literally just to get the reversed list for the for looop
  */
  getEntries() {
    // console.log('upside down');
    const topsyturvy = this.ledgerRef.slice().reverse();
    // console.log(topsyturvy);
    return topsyturvy;
  }

  /*
  BRING MODAL BACK. USING A ROUTER FOR NOW, TILL it works
  editEntry(entry: OmniscientTransaction) {
    console.log('HERE NOW: ABOUT TO edit an entry');
    console.log(entry);
    // console.log(this.editModal.nativeElement);
    // console.log(this.editModal);
    this.currentEntry = {...entry};
    
    this.editingModal = true;
    this.editComponent = EditTransactionComponent;
    // const amodal = AmodalComponent;
    
    // this.statusControl.addStatus('Editing: ' + entry.date);
  }
  */
  
}
