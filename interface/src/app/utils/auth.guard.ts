import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

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
      this.ethService.user$.pipe(take(1)).subscribe((user) => {
        console.log('user: ' + JSON.stringify(user));
        if (!user || user == null) {
          resolve(false);
        } else if (next.data.requiresAdmin) {
          resolve(user.isAdmin);
        } else if (next.data.requiresStoreOwner) {
          resolve(user.isStoreOwner);
        } else {
          resolve(true);
        }
      });
    });
  }
}
