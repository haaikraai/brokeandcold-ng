
import { Component, inject, input } from '@angular/core';
import { BeanServiceService } from '../bean-service.service';
import { Transaction } from '../transaction';
import { DatePipe } from '@angular/common';
import { AppComponent } from '../app.component';
import { StatusControlService } from '../status-control.service';

@Component({
  selector: 'app-ledger-view',
  imports: [DatePipe],  
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
  private ledgerData: Transaction[];
  private _displayedLedger: Transaction[] = [];
  private statusControl = inject(StatusControlService);
  get displayedLedger(): Transaction[] {
    this._displayedLedger = this.ledgerData.slice(0, Math.min(this.maxRows(),this.ledgerData.length));
    return this._displayedLedger;
  }
  // set displayedLedger(value: Transaction[]) {
  // }

  maxRows = input<number>(8);
  

  constructor() {
    // put initialization in constructor so that fresh data is obtained each time.
    this.ledgerData = this.beanService.ledger.ledgerData;

  }

  ngOnInit() {
  
  }

  renderLog(placementElement: HTMLElement, rows: number = 8) {
    // nothing here. Angular does the rendering
  }

  editEntry(entry: Transaction) {
    this.statusControl.addStatus('Editing: ' + entry.date);
  }



}
