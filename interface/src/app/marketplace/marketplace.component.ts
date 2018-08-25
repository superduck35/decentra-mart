import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DMartEthService, Store } from '../services/eth.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {

  loading = true;
  error = false;
  stores: Store[] = [];

  constructor(private ethService: DMartEthService, private router: Router) { }

  ngOnInit() {
    this.loadAllStores();
  }

  async loadAllStores() {
    try {
      const stores = await this.ethService.getAllStores();
      this.stores = stores;
      this.loading = false;
    } catch (e) {
      this.error = true;
      this.loading = false;
    }
  }

  openStore(address: string) {
    this.router.navigate(['store/', address]);
  }
}
