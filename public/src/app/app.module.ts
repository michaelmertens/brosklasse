import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { AdminModule, adminRouting } from './feature/admin/admin.module';
import { AdminComponent } from './feature/admin/admin.component';

/*
 Route Configuration
 */
const routes: Routes = [
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
