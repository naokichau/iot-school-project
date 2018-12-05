import { Component, OnInit } from '@angular/core';
import { IotApiService } from '../iot-api.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public userDevices = [];

  constructor(public api: IotApiService, public events: Events) {
    this.api.getDeviceList();
    this.events.subscribe('devicelist', (list) => {
      this.userDevices = this.api.deviceList;
    });
  }
  ngOnInit() {

  }

  getSwitches(deviceData) {
    return Object.keys(deviceData);
  }
  getPower(powerStr) {
    return parseInt(powerStr, 10);
  }

  switchChange(deviceId, sw, events) {
    console.log(deviceId, sw, event);
    this.api.getDevice(deviceId).then((res: any) => {
      if (sw === 'door') {
        const cmdData = res.latestData.data;
        cmdData.door = (events.detail.checked) ? '1' : '0';
        this.api.sendCmd({ deviceId: deviceId, data: cmdData });
      } else {
        const cmdData = res.latestData.data;
        cmdData[sw] = events.detail.value.toString();
        this.api.sendCmd({ deviceId: deviceId, data: cmdData });
      }
    });
  }
}
