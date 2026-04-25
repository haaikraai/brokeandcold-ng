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
  public beanService = inject(BeanServiceService)


  get balance(): number {
    return this.beanService.balance;
  }
  

  ngOnInit(): void {
    this.statusControl.changeActiveLeftBtn("Settings");
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
    this.beanService.ledger.saveHistory();
  }

  onLoadButton() {
    this.beanService.loadBalance();
    this.beanService.ledger.loadHistory();
    this.statusControl.addStatus('Manually loaded balance');
  }

  onTestButton() {
    
  }

  ngOnDestroy() {
    console.log('destroying mainview');
    // clearInterval(this.timer);
  }
}
