import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IotApiService } from '../iot-api.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
})
export class DevicePage implements OnInit {
  private deviceID: string;
  public deviceData;
  roomActionSheet: any = {
    header: 'Choose device room'
  };
  public slideOpts = {
    zoom: {
      toggle: false
    }
  };
  constructor(private route: ActivatedRoute, public alertController: AlertController, private api: IotApiService) {
    this.deviceID = route.snapshot.paramMap.get('id');
    this.api.getDevice(this.deviceID).then((res: any) => {
      this.deviceData = res;
    });
  }

  ngOnInit() {

  }

  async presentDeviceDetail() {
    const alert = await this.alertController.create({
      header: 'Device detail',
      message: 'Device ID: blah blah\n Manufacturer: ABC\n',
      buttons: ['OK']
    });

    await alert.present();
  }

  switchDevice(sw) {
    // if (this.deviceData.latestData.data[sw] != '0') {
    //   this.deviceSwitch = false;
    // } else {
    //   this.deviceSwitch = true;
    // }
  }

  changeRoom(event) {
    console.log(this.deviceData.location);
    if (event.detail.value === 'add') {
      this.addRoomPrompt();
      this.deviceData.location = this.deviceData.location;
    } else {

    }
  }

  async addRoomPrompt() {
    const alert = await this.alertController.create({
      header: 'New room name',
      inputs: [
        {
          name: 'roomname',
          type: 'text',
          placeholder: 'your new room name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  getSwitches(deviceData) {
    return Object.keys(deviceData);
  }

}
