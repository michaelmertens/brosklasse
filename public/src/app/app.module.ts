import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { AdminModule } from './feature/admin/admin.module';
import { DashboardComponent } from './feature/admin/dashboard/dashboard.component';

/*
 Route Configuration
 */
const routes: Routes = [
  { path: 'admin', component: DashboardComponent },
  { path: ':code', component: RegistrationComponent },
  { path: '', component: RegistrationComponent },
];

/*
 AppModule
 */
@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent
  ],
  imports: [
    HttpClientModule,
    CoreModule.forRoot(),
    SharedModule,
    AdminModule,
    BrowserModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    console.info('Brosklasse AppModule loaded..');
  }
}
