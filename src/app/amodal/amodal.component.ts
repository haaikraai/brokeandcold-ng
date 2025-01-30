import { Component } from '@angular/core';
import { Transaction } from '../transaction';

@Component({
  selector: 'app-amodal',
  imports: [],
  templateUrl: './amodal.component.html',
  styleUrl: './amodal.component.css'
})
export class AmodalComponent {

  // entry = input<Transaction>()
  // closingModal = output<Transaction | null>();

  closeModal() {
    console.log('closing modal');
    // this.closingModal.emit(null);
    
  }

  // modalContent = ContentChild()

}
