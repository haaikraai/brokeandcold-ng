import { Component, inject } from '@angular/core';
import { Router, RouterLink} from '@angular/router';
// import { BeanServiceService } from '../bean-service.service';
import { StatusControlService } from '../status-control.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {

  private router = inject(Router);
  statusControl = inject(StatusControlService);

  constructor() { }

  gotoSettings() {
    console.log('let us go to settings!!!!');
    this.router.navigate( ['/settings']);
  }

  gotoHistory() {
    // TODO: implement history page
    console.log('No history page implemented yet!');
    // this.router.navigate( ['/history']);
  }
  
}
