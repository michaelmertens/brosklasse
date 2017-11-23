import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ApiService } from './services/api.service';
import { LogService } from './services/log.service';
import { RegistrationService } from './services/registration.service';
import { AuthService } from './services/auth.service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  providers: [
    LogService,
    AuthService,
    ApiService,
    RegistrationService,
  ],
  declarations: []
})
export class CoreModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [],
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }

}
