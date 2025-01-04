import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from './topbar/topbar.component';
import { StatusControlService } from './status-control.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'brokeandcold-ng';
  statusText = 'blank';
  private statusControl = inject(StatusControlService);
  
  ngOnInit() {
    setTimeout(() => {
      this.statusControl.addStatus('ready');
      console.log(this.statusControl.getStatus());
    }, 4000)
  }

  addStatus(message: string) {
    console.log('Adding status: ' + message);
    this.statusControl.addStatus(message);
  }
    
  
}
