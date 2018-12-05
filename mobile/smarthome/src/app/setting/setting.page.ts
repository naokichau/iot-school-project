import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { IotApiService } from '../iot-api.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  public serverURL = '';
  public hideSave = true;
  constructor(public events: Events, public api: IotApiService) {
  }

  ngOnInit() {
    this.serverURL = this.api.wsurl;
  }
  saveSetting() {
    this.api.reset(this.serverURL);
  }
  unhide(event) {
    console.log(event);
    this.hideSave = false;
  }
}
