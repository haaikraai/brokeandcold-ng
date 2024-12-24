import { Routes } from '@angular/router';
import { MainviewComponent } from './mainview/mainview.component';
import { SettingsPageComponent } from './settingspage/settingspage.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'mainview',
        pathMatch: 'full'
    },
    {
        path: 'mainview',
        component: MainviewComponent,
    },
    {
        path: 'settings',
        component: SettingsPageComponent,
    }
];
