import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { storeAbi } from '../contracts';
import { DMartEthService, Product, Store } from '../services/eth.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {

  loading = true;
  store: Store;

  storeContract;

  buyItem: number;
  processing = false;
  error = false;
  success = false;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private ethService: DMartEthService) {
  }

  ngOnInit() {
    this.activatedRoute.params.pipe(take(1)).subscribe((params) => {
      const address = params['address'];
      this.loadStore(address);
    });
  }


  async loadStore(address: string) {
    try {
      const store = await this.ethService.getStore(address);
      this.store = store;
      this.loading = false;
    } catch (e) {
      this.loading = false;
    }
  }

  async purchase(product: Product) {
    this.processing = true;
    this.success = false;
    this.error = false;
    this.buyItem = product.id;

    try {
      const tx = await this.ethService.buyProduct(this.store.address, product);
      this.success = tx.status;
      if (this.success) {
        const x = await this.ethService.getProduct(this.store.address, product.id);
        product.stock = x.stock;
      }
      this.error = !tx.status;
      this.processing = false;
    } catch (e) {
      this.error = true;
      this.processing = false;
    }

  }
}

