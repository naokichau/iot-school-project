import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  { path: 'device/:id', loadChildren: './device/device.module#DevicePageModule' },
  { path: 'add-device', loadChildren: './add-device/add-device.module#AddDevicePageModule' },
  { path: 'setting', loadChildren: './setting/setting.module#SettingPageModule' },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
  { path: 'notification', loadChildren: './notification/notification.module#NotificationPageModule' },
  { path: 'data-record/:id', loadChildren: './data-record/data-record.module#DataRecordPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
