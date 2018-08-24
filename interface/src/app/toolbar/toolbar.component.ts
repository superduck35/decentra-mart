import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

import { NetworkType, WalletType, Web3LoadingStatus } from 'web3-service-lib';
import { DMartEthService, User } from '../services/eth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements AfterViewInit {

  web3Sub: Subscription;
  web3Status: Web3LoadingStatus;
  user: User;

  walletConnected = false;

  constructor(private ethService: DMartEthService) { }

  ngAfterViewInit() {
    this.ethService.web3Status$.subscribe((status: Web3LoadingStatus) => {
      console.log(status);
      this.web3Status = status;
      if (status === Web3LoadingStatus.complete) {
        this.walletConnected = true;
        this.ethService.user$.subscribe((user: User) => {
          this.user = user;
        });
      } else {
        this.walletConnected = false;
      }
    });
  }
}
