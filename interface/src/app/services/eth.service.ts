import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

import { EthService, NetworkType, WalletType, Web3LoadingStatus } from 'web3-service-lib';
import { environment } from '../../environments/environment';
import { adminAbi, managementAbi, storeAbi } from '../contracts';

declare var require;
const blockies = require('ethereum-blockies-png');

export class User {
  address: string;
  avatar: string;
  isAdmin: boolean;
  isStoreOwner: boolean;
}


export class Store {
  address: string;
  avatar: string;
  name: string;
  open: boolean;
  products: Array<Product> = [];

  constructor(init?: Partial<Store>) {
    Object.assign(this, init);
  }
}

export class Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  active: boolean;

  constructor(init?: Partial<Product>) {
    Object.assign(this, init);
  }
}


@Injectable({
  providedIn: 'root'
})
export class DMartEthService extends EthService {

  adminContract: any;
  storeManagementContract: any;

  ADMIN_ROLE = 'Admin';
  STORE_OWNER_ROLE = 'Store Owner';

  private user = new BehaviorSubject<User>(null);
  public user$ = this.user.asObservable();

  constructor(http: Http) {
    super({ netType: environment.targetNetwork }, http);
    this.adminContract = this.createContractInstance(adminAbi, environment.contracts.admin);
    this.storeManagementContract = this.createContractInstance(managementAbi, environment.contracts.storeManagement);

    this.account$.subscribe(async (acc: string) => {
      if (acc) {
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


  addStoreOwner(address: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const txObject = await this.adminContract.methods.addStoreOwner(address);
        // const gasPrice = await this.getDefaultGasPriceGwei();
        const txOptions = {
          from: this.account.getValue(),
          value: '0x0',
          gasLimit: this.defaultGasParam,
          gasPrice: '11000000000',
          data: txObject.encodeABI(),
        };
        txObject.send(txOptions, (err, txHash) => this.resolveTransaction(err, txHash, resolve, reject));
      } catch (e) {
        reject();
      }
    });
  }

  async getAllStoreOwners(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const storeOwners = await this.adminContract.methods.getStoreOwners().call();
      resolve(storeOwners);
    });
  }
  getAllStores(): Promise<Store[]> {
    return new Promise(async (resolve, reject) => {
      const storeOwners: string[] = await this.getAllStoreOwners();
      const stores: Store[] = [];
      for (let i = 0; i < storeOwners.length; i++) {
        const userStores = await this.storeManagementContract.methods.getStoresByOwner(storeOwners[i]).call();
        for (let j = 0; j < userStores.length; j++) {
          stores.push(await this.getStore(userStores[j]));
        }
      }
      resolve(stores);
    });
  }

  async getStore(address: string): Promise<Store> {
    const storeContract = this.createContractInstance(storeAbi, address);
    const avatar = this.getAvatar(address);
    const name = await storeContract.methods.name().call();
    const open = await storeContract.methods.open().call();
    const products = await this.getProducts(address);
    return new Store({ avatar, address, name, open, products });
  }

  async getProducts(storeAddress: string): Promise<Product[]> {
    const storeContract = this.createContractInstance(storeAbi, storeAddress);
    const numberOfProducts = await storeContract.methods.numberOfProducts().call();
    const products: Product[] = [];
    for (let i = 0; i < numberOfProducts; i++) {
      const product = await storeContract.methods.getProduct(i).call();
      products.push(new Product({
        id: product[0],
        name: product[1],
        price: product[2],
        stock: product[3],
        active: product[4]
      }));
    }
    return products;
  }


  async getProduct(storeAddress: string, productId: number): Promise<Product> {
    const storeContract = this.createContractInstance(storeAbi, storeAddress);
    const product = await storeContract.methods.getProduct(productId).call();
    return new Product({
      id: product[0],
      name: product[1],
      price: product[2],
      stock: product[3],
      active: product[4]
    });
  }

  async buyProduct(storeAddress: string, product: Product): Promise<any> {
    const storeContract = this.createContractInstance(storeAbi, storeAddress);
    return new Promise(async (resolve, reject) => {
      try {
        const txObject = await storeContract.methods.purchaseProduct(product.id);
        // const gasPrice = await this.getDefaultGasPriceGwei();
        const txOptions = {
          from: this.account.getValue(),
          value: product.price,
          gasLimit: this.defaultGasParam,
          gasPrice: '11000000000',
          data: txObject.encodeABI(),
        };
        txObject.send(txOptions, (err, txHash) => this.resolveTransaction(err, txHash, resolve, reject));
      } catch (e) {
        reject();
      }
    });
  }

}
