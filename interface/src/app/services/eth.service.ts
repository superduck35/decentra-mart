import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

import { EthService, NetworkType, WalletType, Web3LoadingStatus } from 'web3-service-lib';
import { environment } from '../../environments/environment';
import { DMartAdmin } from '../contracts';

declare var require;
const blockies = require('ethereum-blockies-png');

export class User {
  address: string;
  avatar: string;
  isAdmin: boolean;
  isStoreOwner: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class DMartEthService extends EthService {

  adminContract: any;

  ADMIN_ROLE = 'Admin';
  STORE_OWNER_ROLE = 'Store Owner';

  private user = new BehaviorSubject<User>(null);
  public user$ = this.user.asObservable();

  constructor(http: Http) {
    super(http);
    this.adminContract = this.createContractInstance(DMartAdmin.abi, environment.dMartAdminAddress);

    this.account$.subscribe(async (acc: string) => {
      if (acc && this.isCorrectNetwork) {
        const isAdmin = await this.hasAdminRole(acc);
        const isStoreOwner = await this.hasStoreOwnerRole(acc);
        this.user.next({
          address: acc,
          avatar: this.getAvatar(acc),
          isAdmin,
          isStoreOwner
        });
      } else {
        this.user.next(null);
      }
    });
  }

  get isCorrectNetwork(): boolean {
    return this.netType === environment.targetNetwork;
  }

  hasAdminRole(address: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const hasRole = await this.adminContract.methods.hasRole(address, this.ADMIN_ROLE).call();
      resolve(hasRole);
    });
  }

  hasStoreOwnerRole(address: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const hasRole = await this.adminContract.methods.hasRole(address, this.STORE_OWNER_ROLE).call();
      resolve(hasRole);
    });
  }

  getAvatar(address: string): string {
    const seed = address.toLowerCase();
    return blockies.createDataURL({ seed });
  }
}
