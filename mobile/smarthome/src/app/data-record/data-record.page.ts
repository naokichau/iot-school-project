import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IotApiService } from '../iot-api.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-data-record',
  templateUrl: './data-record.page.html',
  styleUrls: ['./data-record.page.scss'],
})
export class DataRecordPage implements OnInit {
  private deviceID: string;
  public deviceData;
  public deviceRecords = [];
  constructor(private route: ActivatedRoute, private api: IotApiService, public events: Events) {
    this.deviceID = route.snapshot.paramMap.get('id');
    this.api.getDevice(this.deviceID).then((res: any) => {
      this.deviceData = res;
      this.api.getDeviceRecord(this.deviceID);
    });
    this.events.subscribe('devicerecord-' + this.deviceID, (records) => {
      console.log(records);
    });
  }

  ngOnInit() {
  }

}
