import { Component, inject, input, output, OutputEmitterRef } from '@angular/core';
import { FormsModule, NgForm, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Transaction } from '../transaction';
import { DatePipe } from '@angular/common';



@Component({
  standalone: true,
  selector: 'app-edit-transaction',
  imports: [ReactiveFormsModule, FormsModule, DatePipe],
  templateUrl: './edit-transaction.component.html',
  styleUrl: './edit-transaction.component.css',
})
export class EditTransactionComponent {

  // entryDetails = input<any>({ date: Date.now(), tags: [], amount: 0 } as Transaction, { transform: (entry: Transaction | undefined) => { return formatEntryDate(entry) }});
  entryDetails = input<Transaction, Transaction>({} as Transaction,
    {
      debugName: 'editInput',
      transform: formatEntryDate
    });

  updatedEntry = output<Transaction>()
  closeForm = output<Boolean>()





  // private fb = inject(FormBuilder)

  ngOnInit() {
    console.log('******HERE IN EDIT TRANSACTION NOW*******');
    console.log(this.entryDetails);
    console.log(this.updatedEntry);

    this.closeForm.subscribe((val) => {
      console.log('closeForm has been called with value: ' + val);
    })
    // this.editForm = new FormGroup({
    //   amount: new FormControl(this.entryDetails().amount),
    //   tags: new FormControl(this.entryDetails().tags),
    //   date: new FormControl(this.entryDetails().date),
    //   cancel: new FormControl(),
    //   sav: new FormControl(),
    // });


  }

  constructor() { }


  onCancelButton() {
    console.log('pressed cancel. Emiting updatedEntry as well as closeForm')
    // close modal and emit same as input
    this.updatedEntry.emit(this.entryDetails());
    this.closeForm.emit(true);
    console.log('it has been emitted indeeed.');
  }

  onSaveButton() {
    // console.log(this.editForm.value);
    // save stuff
    // super.isOpen.set(false);
    this.closeForm.emit(true);
  }
}

function formatEntryDate(entry: Transaction): Transaction {
  let formatedEntry = entry
  console.log('transforming input date from: ');
  console.log(formatedEntry);
  if (formatedEntry) {
    formatedEntry.date = new Date(formatedEntry.date).toISOString().split('T')[0];
    console.log('to:');
    console.log(formatedEntry);
  }
  return formatedEntry;
}

function doNotTransform(entry: any) {
  console.log('NOT TRANSFORMING:')
  console.log(entry);
  return entry
}