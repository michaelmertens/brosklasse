import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
  ],
  declarations: [DashboardComponent]
})
export class AdminModule { }
