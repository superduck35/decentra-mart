import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { DMartEthService } from '../services/eth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private ethService: DMartEthService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      console.log('hit auth guard');
    return new Promise(async (resolve, reject) => {
      const user = await this.ethService.user$.toPromise();
      if (!user) {
        resolve(false);
      }
      if (next.data.requiresAdmin) {
        resolve(user.isAdmin);
      }
      if (next.data.requiresStoreOwner) {
        resolve(user.isStoreOwner);
      }
      resolve(true);
    });
  }
}
