import { Pipe, PipeTransform } from '@angular/core';

declare var require;
const Web3 = require('web3');

@Pipe({
  name: 'weiToEth'
})
export class WeiToEthPipe implements PipeTransform {

  transform(wei: string, args?: any): number {
    // const weiString = Web3.utils.toBN(Web3.utils.toHex(wei)).toString();
    return Web3.utils.fromWei(wei, 'ether');
  }

}
