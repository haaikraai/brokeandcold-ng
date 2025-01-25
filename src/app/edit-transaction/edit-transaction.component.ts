import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Transaction } from '../transaction';



@Component({
  standalone: true,
  selector: 'app-edit-transaction',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-transaction.component.html',
  styleUrl: './edit-transaction.component.css',
})
export class EditTransactionComponent {

  entryDetails = input<Transaction>({ date: 0, tags: [], amount: 0 })
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
    // close modal
  }

  onSaveButton() {
    // save stuff
  }
}