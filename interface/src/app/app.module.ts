import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatButtonModule, MatCardModule, MatIconModule, MatToolbarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { Web3ServiceModule } from 'web3-service-lib';
import { environment } from '../environments/environment';
import { AdminComponent } from './admin/admin.component';
import { AppComponent } from './app.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { DMartEthService } from './services/eth.service';
import { StoreComponent } from './store/store.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AuthGuard } from './utils/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    MarketplaceComponent,
    ToolbarComponent,
    AdminComponent,
    StoreComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    RouterModule.forRoot([
      {
        path: '',
        component: MarketplaceComponent
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: { requiresAdmin: true }
      },
      {
        path: 'store/:address',
        component: StoreComponent
      },
    ]),
    Web3ServiceModule.forRoot({
      netType: environment.targetNetwork
    })
  ],
  providers: [
    DMartEthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
