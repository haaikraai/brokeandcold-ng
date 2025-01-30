
import { Component, ElementRef, HostBinding, inject, input, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { BeanServiceService } from '../bean-service.service';
import { Transaction } from '../transaction';
import { DatePipe } from '@angular/common';
import { StatusControlService } from '../status-control.service';
import { AmodalComponent } from '../amodal/amodal.component';
import { EditTransactionComponent } from "../edit-transaction/edit-transaction.component";

@Component({
  selector: 'app-ledger-view',
  imports: [DatePipe, EditTransactionComponent,AmodalComponent],
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
  private ledgerData!: Transaction[];
  private _displayedLedger: Transaction[] = [];
  private statusControl = inject(StatusControlService);
  // private route = inject
  // private comp = NgComponentOutlet
  editingModal = false;


  // editModal: ElementRef<HTMLElement> = ViewChild('#editfo', {read: ElementRef, static: false})
  get displayedLedger(): Transaction[] {
    this._displayedLedger = this.ledgerData.slice(0, Math.min(this.maxRows(), this.ledgerData.length));
    return this._displayedLedger;
  }
  // set displayedLedger(value: Transaction[]) {
  // }


  maxRows = input<number>(8);
  currentEntry = signal<Transaction>({ date: Date.now(), tags: ['initial','tags'], amount: 222 });

  constructor() {
    // put initialization in constructor so that fresh data is obtained each time.
  }

  ngOnInit() {
    this.ledgerData = this.beanService.ledger.ledgerData;

  }

  renderLog(placementElement: HTMLElement, rows: number = 8) {
    // nothing here. Angular does the rendering
  }



  editEntry(entry: Transaction) {
    console.log('HERE NOW: ABOUT TO edit an entry');
    console.log(entry);
    // console.log(this.editModal.nativeElement);
    // console.log(this.editModal);
    console.log('updating entry details in 5');
    setTimeout(() => {
      console.log('Dadaaaaa');
      this.currentEntry.set(entry);
    }, 5000)
    
    this.editingModal = true;
    this.statusControl.addStatus('Editing: ' + entry.date);
  }

  modalClosed(newEntry: Transaction | null) {
    if (newEntry) {
      this.currentEntry.set(newEntry);
    }
  }



}
