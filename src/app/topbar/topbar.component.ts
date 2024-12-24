import { Component, inject, input } from '@angular/core';
import { BeanServiceService } from '../bean-service.service';
import { StatusControlService } from '../status-control.service';

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  statusControl = inject(StatusControlService);

  constructor() { }
}
