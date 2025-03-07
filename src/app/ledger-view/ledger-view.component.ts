
import { Component, inject, input, Type } from '@angular/core';
import { NgIf } from '@angular/common';
import { BeanServiceService } from '../bean-service.service';
import { OmniscientTransaction, Transaction } from '../transaction';
import { DatePipe } from '@angular/common';
import { AmodalComponent } from '../amodal/amodal.component';
import { EditTransactionComponent } from "../edit-transaction/edit-transaction.component";
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-ledger-view',
  imports: [DatePipe, EditTransactionComponent, JsonPipe, NgIf],
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
  private _displayedLedger: OmniscientTransaction[] = [];
  
  // private route = inject
  // private comp = NgComponentOutlet
  editingModal = false;
  protected editComponent: Type<AmodalComponent> | Type<EditTransactionComponent> | null = EditTransactionComponent;
  
  

  // editModal: ElementRef<HTMLElement> = ViewChild('#editfo', {read: ElementRef, static: false})
  get displayedLedger(): OmniscientTransaction[] {
    this._displayedLedger = this.beanService.ledger.ledgerData.slice(0, Math.min(this.maxRows(), this.beanService.ledger.ledgerData.length)).reverse();
    return this._displayedLedger;
  }
  set displayedLedger(value: OmniscientTransaction[]) {
    this._displayedLedger = [...value];
  }

  


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
  onSave(newEntry: OmniscientTransaction | null) {
    const updatedEntry = JSON.parse(JSON.stringify(newEntry));
    this.editingModal = false;
    if (updatedEntry) {
      this.currentEntry = <OmniscientTransaction>newEntry;
      console.log('Received new entry from form and think I changed it. New values are:')
      console.log(updatedEntry);
      const changedTrancaction: Transaction = {
        date: Date.now(),
        tags: ['Cooked','the','books'],
        amount: this.beanService.ledger.updateItem(updatedEntry.id, updatedEntry)        
      } 
      this.beanService.balance += changedTrancaction.amount;
      this.beanService.updateBalance(changedTrancaction);
    }
  }

}
