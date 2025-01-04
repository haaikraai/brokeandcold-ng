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

  get balance(): number {
    return this.beanService.balance;
  }
  

  ngOnInit(): void {
    setTimeout(() => {
      
      // this.statusText = 'mainview component ready';
      this.statusControl.addStatus('mainview component ready');
      console.log(this.statusControl.getStatus());


    }, 6000)
  }

  onIncrement() {
    this.beanService.increment();
  }

  onDecrement() {
    this.beanService.decrement();
  }
}
