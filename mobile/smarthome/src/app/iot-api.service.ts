import { Injectable } from '@angular/core';
import { Events, LoadingController, AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class IotApiService {
  private server = {
    connection: <any>{},
    isConnected: false
  };
  // public wsurl = 'ws://localhost:8080/user';
  public wsurl = 'ws://iot-bk-server.herokuapp.com/user';
  private loading;
  public deviceList = [];
  constructor(public events: Events, public loadingController: LoadingController,
    public alertController: AlertController, public toastController: ToastController) {
  }

  async presentAlertGWOff() {
    const toast = await this.toastController.create({
      message: 'Gateway seem to be not connected!',
      duration: 3000,
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'close'
    });
    toast.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: 'This is server url cannot be empty',
      buttons: ['OK']
    });

    await alert.present();
  }
  async presentLoading(msg: string) {
    this.loading = await this.loadingController.create({
      message: msg,
    });
    return await this.loading.present();
  }

  async presentToastConnFailed() {
    const toast = await this.toastController.create({
      message: 'Unable to connect to \n' + this.wsurl,
      duration: 3000,
      showCloseButton: true,
      position: 'bottom',
      color: 'danger',
      closeButtonText: 'Retry'
    });
    let retry = () => {
      this.connect();
    };
    setTimeout(() => {
      retry = () => { };
    }, 2500);
    toast.onDidDismiss().then(() => {
      retry();
    });
    toast.present();
  }

  async presentToastConnSuccess() {
    const toast = await this.toastController.create({
      message: 'Connected to ' + this.wsurl,
      color: 'success',
      duration: 2000,
    });
    toast.present();
  }

  reset(url: string) {
    if (url.trim() !== '') {
      this.server.connection.close();
      this.wsurl = url;
      this.connect();
    } else {
      this.presentAlert();
    }
  }
  isConnected() {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (this.server.isConnected) {
          resolve(this.isConnected);
        }
      }, 500);
      setTimeout(() => {
        clearInterval(interval);
        resolve(false);
      }, 2000);
    });
  }
  connect() {
    this.server.connection = new WebSocket(this.wsurl);
    this.presentLoading('Connecting to server... \n' + this.wsurl);
    this.server.connection.onopen = () => {
      setTimeout(() => {
        console.log('opened');
        this.loading.dismiss();
        this.presentToastConnSuccess();
        this.events.publish('server:connection', true);
        const loginData = {
          msgType: 'login',
          pkey: 'QaiY+CwTOF7InPg2On066n8efLgo7kGnmjKJUq0whMY=',
          sig: 'zKt/ZxTef14oOodknNTqCCNe8LJr6E7f4/hoCDrLn4GvlDc9UmS9FDb2/vxcUim19AgnOyt8KCBk2ACXWMLZDA==',
          data: 's'
        };
        this.server.connection.send(JSON.stringify(loginData));
        this.server.isConnected = true;
        this.getDeviceList();
      }, 500);
    };

    this.server.connection.onerror = (error) => {
      console.log(error);
      setTimeout(() => {
        this.loading.dismiss();
        this.presentToastConnFailed();
      }, 1000);
    };
    this.server.connection.onclose = (event) => {
      console.log(event);
      this.events.publish('server:connection', false);
      this.server.isConnected = false;
    };
    this.server.connection.onmessage = (message) => {
      console.log(message.data);
      const msg = JSON.parse(message.data);
      switch (msg.msgType) {
        case 'devicerecord':
          this.events.publish('devicerecord-' + msg.data.deviceId, msg.data.records);
          break;
        case 'devicelist':
          this.deviceList = msg.data;
          this.deviceList.forEach(device => {
            device.latestData.data = JSON.parse(device.latestData.data);
          });
          this.events.publish('devicelist', this.deviceList);
          break;
        case 'devicedata':
          this.deviceList.forEach(device => {
            if (device.deviceId === msg.data.deviceId) {
              msg.data.data = JSON.parse(msg.data.data);
              device.latestData = msg.data;
            }
          });
          break;
        case 'gatewayoffline':
          this.presentAlertGWOff();
          break;
        default:
          break;
      }
    };
  }

  getDeviceRecord(deviceID: string) {
    return new Promise((resolve, reject) => {
      this.isConnected().then((res) => {
        if (res) {
          this.server.connection.send(JSON.stringify({
            msgType: 'getdevicerecord',
            data: {
              deviceId: deviceID
            }
          }));
          this.events.subscribe('devicerecord-' + deviceID, (records) => {
            resolve(records);
          });
        } else {
          this.presentToastConnFailed();
        }
      });
    });
  }

  getDeviceList() {
    return new Promise((resolve, reject) => {
      this.isConnected().then((res) => {
        if (res) {
          this.server.connection.send(JSON.stringify({
            msgType: 'getmydevices',
          }));
          this.events.subscribe('devicelist', (list) => {
            console.log(list);
            resolve(list);
          });
        } else {
          this.presentToastConnFailed();
        }
      });
    });
  }

  sendCmd(cmd) {
    return new Promise((resolve, reject) => {
      this.isConnected().then((res) => {
        if (res) {
          this.server.connection.send(JSON.stringify({
            msgType: 'cmd',
            data: cmd
          }));
        } else {
          this.presentToastConnFailed();
        }
      });
    });
  }

  editDeviceInfo(deviceId, data) {
    return new Promise((resolve, reject) => {
      this.isConnected().then((res) => {
        if (res) {
          // this.server.connection.send(JSON.stringify({
          //   msgType: 'cmd',
          //   data: cmd
          // }));
        }
      });
    });
  }

  getDevice(deviceId) {
    return new Promise((resolve, reject) => {
      this.deviceList.forEach(device => {
        if (device.deviceId === deviceId) {
          resolve(device);
        }
      });
    });
  }
}
