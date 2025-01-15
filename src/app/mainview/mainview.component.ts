import { Component, inject } from '@angular/core';
import { StatusControlService } from '../status-control.service';
import { BeanServiceService } from '../bean-service.service';


@Component({
  selector: 'app-mainview',
  imports: [],
  templateUrl: './mainview.component.html',
  styleUrl: './mainview.component.css'
})
export class MainviewComponent {

  private statusControl = inject(StatusControlService)
  private beanService = inject(BeanServiceService)

  // temp var for testing
  private timer = 0;

  get balance(): number {
    return this.beanService.balance;
  }
  

  ngOnInit(): void {
    console.log('bullshit timeout for testing');
    setTimeout(() => {
      
      // this.statusText = 'mainview component ready';
      this.statusControl.addStatus('mainview component ready');
      console.log(this.statusControl.getStatus());
      // this.incrementIntermeter();
    }, 7000)
  }
  incrementIntermeter() {
    setInterval(() => {
      this.timer = this.beanService.balance = this.beanService.balance + 1
    }, 1000);
  }

  onIncrement() {
    this.beanService.increment();
  }

  onDecrement() {
    this.beanService.decrement();
  }

  onSaveButton() {
    this.statusControl.addStatus('Manually saved balance');
    this.beanService.saveBalance('Manually saved balance');
  }

  onLoadButton() {
    this.beanService.loadBalance();
    this.statusControl.addStatus('Manually loaded balance');
  }

  onTestButton() {
    console.log(this.beanService.ledger.ledgerData);
  }

  ngOnDestroy() {
    console.log('destroying mainview');
    clearInterval(this.timer);
  }
}
