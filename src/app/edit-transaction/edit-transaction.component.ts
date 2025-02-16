import { Component, inject, input, output, OutputEmitterRef, viewChild, ViewContainerRef } from '@angular/core';
import { FormsModule, NgForm, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { OmniscientTransaction, Transaction } from '../transaction';
import { AmodalComponent } from "../amodal/amodal.component";



@Component({
  standalone: true,
  selector: 'app-edit-transaction',
  imports: [ReactiveFormsModule, FormsModule, AmodalComponent],
  templateUrl: './edit-transaction.component.html',
  styleUrl: './edit-transaction.component.css',
})
export class EditTransactionComponent {

  // entryDetails = input<any>({ date: Date.now(), tags: [], amount: 0 } as Transaction, { transform: (entry: Transaction | undefined) => { return formatEntryDate(entry) }});
  entryDetails = input<OmniscientTransaction, OmniscientTransaction>({} as OmniscientTransaction,
    {
      debugName: 'editInput',
      transform: formatEntryDate
    });

  // keeping this. lol.
  updatedEntry = output<OmniscientTransaction>({})
  updateData: OmniscientTransaction = {id: 0, date: 0, tags: [], amount: 0};
  closeForm = output<Boolean>();
  viewRef = viewChild('editForm', { read: ViewContainerRef});
  // waiitoooo:
  // I'm gonna change the input data now, press cancel, but then the original input has been modified. Fixit.
  originalData: OmniscientTransaction = {...this.entryDetails()};   // this may need to be a setter. dunno, let's see.
  isOpen = false;


  constructor() { 
    console.log('not much to say, but in editing constructor modal up or not, dont care, still constructing shit');
  }

  ngOnInit() {
    console.log('IN editing onINit now');
    this.originalData = {...this.entryDetails()};
    this.isOpen = true;
    
  }


  onCancelButton() {
    // this.updatedEntry.emit(this.originalData);
    console.log('CANCEL paaresssed');
    this.closeForm.emit(false);
    this.isOpen = false;
    // console.log('!!!-----uncomment prev line to actually close the modal. works n all');
  }

  onSaveButton() {
    // console.log(this.editForm.value);
    // save stuff
    // super.isOpen.set(false);
    this.isOpen = false;
    console.log('Updating from'); console.log(this.originalData);
    this.updatedEntry.emit(deformatExitData(this.entryDetails()));
    console.log('to '); console.log(this.entryDetails());
    this.closeForm.emit(true);
  }
}

function formatEntryDate(entry: OmniscientTransaction): OmniscientTransaction {
  // make a deep copy of entry by values:
  let formatedEntry = {...entry};
  // console.log('transforming input date from: ');
  console.log(formatedEntry);
  if (formatedEntry) {
    formatedEntry.date = new Date(formatedEntry.date).toISOString().split('T')[0];
    // console.log('to:');
    // console.log(formatedEntry);
  }
  return formatedEntry;
}

/**
 * Reverse operation of formatEntryDate. Takes an OmniscientTransaction where the date
 * is a string in 'yyyy-MM-dd' format and returns a new copy of the transaction with
 * the date as a Date object, preferically a timestamp.
 * 
 * Yeah, what this guy said! It's just common decancy man. Retrurn the shape you got it in.
 * @param {OmniscientTransaction} entry
 * @returns {OmniscientTransaction}
 **/
function deformatExitData(entry: OmniscientTransaction): OmniscientTransaction {
  // make a deep copy of entry by values:
  let formatedEntry = {...entry};
  if (formatedEntry) {
    formatedEntry.date = Date.parse(<string>formatedEntry.date);
    // console.log('to FRESH COPY OF Entry saaaying:');
    // console.log(formatedEntry);
  }
  return formatedEntry;
}

function doNotTransform(entry: any) {
  console.log('NOT TRANSFORMING:')
  console.log(entry);
  return entry;

}