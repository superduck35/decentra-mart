import { Component, OnInit } from '@angular/core';

import { DMartEthService } from '../services/eth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  storeOwner: string;
  processing = false;
  success = false;
  error = false;

  constructor(private ethService: DMartEthService) { }

  ngOnInit() {
  }

  async addStoreOwner(address: string) {
    this.processing = true;
    this.success = false;
    this.error = false;
    try {
      const tx = await this.ethService.addStoreOwner(address);
      this.success = tx.status;
      this.success = !tx.status;
    } catch (e) {
      this.error = true;
    }

    this.processing = false;
  }
}
