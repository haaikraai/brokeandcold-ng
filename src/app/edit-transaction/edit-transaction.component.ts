import { Component, inject, input, output } from '@angular/core';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
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

  entryDetails = input<Transaction>({ date: Date.now(), tags: [], amount: 0 })
  updatedEntry = output<Transaction>()
  editForm: FormGroup = new FormGroup({});
  


  // private fb = inject(FormBuilder)

  ngOnInit() {
    this.editForm = new FormGroup({
      amount: new FormControl(this.entryDetails().amount),
      tags: new FormControl(this.entryDetails().tags),
      date: new FormControl(this.entryDetails().date),
      cancel: new FormControl(),
      sav: new FormControl(),
    });

    
  }

  constructor() {}

  


  onCancelButton() {
    
    // close modal and emit same as input
    this.updatedEntry.emit(this.entryDetails());
  }

  onSaveButton() {
    console.log(this.editForm.value);
    // save stuff
  }
}