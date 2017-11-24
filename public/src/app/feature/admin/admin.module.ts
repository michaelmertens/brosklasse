import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { RegistrationOverviewComponent } from './registration-overview/registration-overview.component';

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
  ],
  declarations: [DashboardComponent, RegistrationOverviewComponent]
})
export class AdminModule { }
