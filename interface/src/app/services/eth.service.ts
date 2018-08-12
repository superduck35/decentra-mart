import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

import { EthService, NetworkType, WalletType, Web3LoadingStatus } from 'web3-service-lib';

@Injectable({
  providedIn: 'root'
})
export class DMartEthService extends EthService {

  constructor(http: Http) {
    super(http);

  }
}
