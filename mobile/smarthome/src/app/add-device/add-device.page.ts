import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.page.html',
  styleUrls: ['./add-device.page.scss'],
})
export class AddDevicePage implements OnInit {
  public isScanning = true;
  constructor() { }

  ngOnInit() {
  }
  scan() {
    if (this.isScanning) {
      this.isScanning = false;
    } else {
      this.isScanning = true;
    }
  }
}
