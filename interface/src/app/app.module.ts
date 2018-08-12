import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MatButtonModule, MatIconModule, MatToolbarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { Web3ServiceModule } from 'web3-service-lib';
import { AppComponent } from './app.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { DMartEthService } from './services/eth.service';

@NgModule({
  declarations: [
    AppComponent,
    MarketplaceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    RouterModule.forRoot([
      {
        path: '',
        component: MarketplaceComponent
      }
    ]),
    Web3ServiceModule.forRoot()
  ],
  providers: [
    DMartEthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
