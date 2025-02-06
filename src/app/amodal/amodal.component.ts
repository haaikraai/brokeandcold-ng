import { Component, input, model, output, signal,  } from '@angular/core';
// import { Transaction } from '../transaction';

@Component({
  selector: 'app-amodal',
  imports: [],
  templateUrl: './amodal.component.html',
  styleUrl: './amodal.component.css',
})
export class AmodalComponent {

  // entry = input<Transaction>()
  // closingModal = output<Transaction | null>();
  // PHILOSPHY:
  // the opener must be responsible for closing the modal. Seems fair.
  isOpen = input<Boolean>(false);
  // closingEvent = output<Boolean>();

  
  
  constructor() {
  }

  closeModal() {
    console.log('closing modal instruction recieved. But ');
    // Details done in the parent thuogh, but emiting event.
    // Alternative is make the modal template itself the structural directive...
    // this.closingModal.emit(null);
    console.log(this.isOpen());
  }

  // modalContent = ContentChild()

}
