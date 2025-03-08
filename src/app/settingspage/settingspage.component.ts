import { Component } from '@angular/core';
import { BeanService } from 'bean-service.service.ts';

@Component({
  selector: 'app-settingspage',
  imports: [],
  templateUrl: './settingspage.component.html',
  styleUrl: './settingspage.component.css'
})
export class SettingspageComponent {
    private beanService = inject(BeanService);
    settingsData = this.beanService.balanceData;

    constructor() {}

    OnInit() {
        console.log('opening settings. data is:');
        console.log(this.settingsData);
        }
}
