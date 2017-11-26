import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { RegistrationOverviewComponent } from './registration-overview/registration-overview.component';
import { AdminComponent } from './admin.component';
import { MyReservationsComponent } from './my-reservations/my-reservations.component';
import { AdminRoutingModule } from './admin.routing';

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    AdminRoutingModule,
  ],
  declarations: [
    DashboardComponent,
    RegistrationOverviewComponent,
    AdminComponent,
    MyReservationsComponent,
  ],
})
export class AdminModule { }
