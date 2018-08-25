import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { DMartEthService, Product, Store } from '../services/eth.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {

  address: string;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private ethService: DMartEthService) {
  }

  ngOnInit() {
    this.activatedRoute.params.pipe(take(1)).subscribe((params) => {
      this.address = params['address'];
    });

  }
}

