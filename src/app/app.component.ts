import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from './topbar/topbar.component';
import { StatusControlService } from './status-control.service';
import { LedgerViewComponent } from "./ledger-view/ledger-view.component";
import { BeanServiceService } from './bean-service.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopbarComponent, LedgerViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'brokeandcold-ng';
  statusText = 'blank';
  private statusControl = inject(StatusControlService);
  private beanService = inject(BeanServiceService);
  ngOnInit() {
    setTimeout(() => {
      this.statusControl.addStatus('ready');
      console.log(this.statusControl.getStatus());
    }, 4000)
  }

  addStatus(message: string) {
    console.log('Adding status: ' + message);
    this.statusControl.addStatus(message);
    console.log(this.beanService.balance);
  }

  testStuff() {
    console.log('TESTING: changing balance by 50');
    this.beanService.balance = this.beanService.balance + 50;
 }
    
  
}
