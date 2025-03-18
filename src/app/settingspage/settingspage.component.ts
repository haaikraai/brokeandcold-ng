import { Component, inject, input } from '@angular/core';
import { BeanServiceService } from '../bean-service.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, NgForm, NonNullableFormBuilder } from '@angular/forms';
import { OmniscientTransaction } from '../transaction';
import { iif } from 'rxjs';

@Component({
  selector: 'app-settingspage',
  imports: [ReactiveFormsModule],
  templateUrl: './settingspage.component.html',
  styleUrl: './settingspage.component.css'
})
export class SettingspageComponent {
  private beanService = inject(BeanServiceService);
  private fb = inject(NonNullableFormBuilder);

  

  // settingsForm = new FormGroup({
  //   balance: new FormControl(this.formData.balance, [Validators.required]),
  //   dailyAmount: new FormControl(this.formData.dailyAmount, [Validators.required, Validators.min(0)]),
  //   incAmount: new FormControl(this.formData.incAmount, [Validators.required, Validators.min(0)]),
  //   decAmount: new FormControl(this.formData.decAmount, [Validators.required, Validators.min(0)]),
  //   lastUpdateDate: new FormControl(this.formData.lastUpdated, [Validators.required]),
  // }, { updateOn: 'blur' })

  testForm = new FormGroup({
    testControl: new FormControl('Am I real?'),
    testTwo: new FormControl(5)
  });

  settingsForm: FormGroup<{
    balance: FormControl<number>;
    dailyAmount: FormControl<number>;
    incAmount: FormControl<number>;
    decAmount: FormControl<number>;
    lastUpdated: FormControl<string>;
  }>

  constructor() { 
    this.settingsForm = this.fb.group({
      balance: [this.beanService.balanceData.balance, Validators.required],
      dailyAmount: [this.beanService.balanceData.dailyAmount, Validators.required],
      incAmount: [this.beanService.balanceData.incAmount, Validators.required],
      decAmount: [this.beanService.balanceData.decAmount, Validators.required],
      lastUpdated: [formatDateToHtml(this.beanService.balanceData.lastUpdated), Validators.required]
  });
}

  ngOnInit() {
    console.log('opening settings. data is:');
    // console.log(this.settingsForm.value);
  }

  onTestSubmit() {
    console.log('It submits indeed');
    console.log(this.settingsForm.value);
  }

  onSubmit() {
    console.log('Submitting');
    console.log(this.settingsForm.value);
    const originalData = {...this.beanService.balanceData};

    const updatedData = {...this.settingsForm.getRawValue()};

    // this.beanService.balanceData = {
    const toSaveData = {
      balance: updatedData.balance,
      dailyAmount: updatedData.dailyAmount,
      incAmount: updatedData.incAmount,
      decAmount: updatedData.decAmount,
      lastUpdated: deformatDateFromHtml(updatedData.lastUpdated),
    };

    console.log('Data saved:');
    
    
    this.beanService.balanceData = toSaveData;
    if (toSaveData.lastUpdated != originalData.lastUpdated) {
      this.beanService.balanceData.lastUpdated = originalData.lastUpdated;
      this.beanService.updateDate();
    }
    console.log(this.beanService.balanceData);
    
  }
}

function formatDateToHtml(date: number): string {
  // make a deep copy of entry by values:
  let formatedDate = new Date(date).toISOString().split('T')[0];
  return formatedDate;
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
function deformatDateFromHtml(date: string): number {
  // make a deep copy of entry by values:
  let formatedDate = new Date(date).valueOf();
  return formatedDate;
}
