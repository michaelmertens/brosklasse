import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MyReservationsComponent } from './my-reservations/my-reservations.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin.component';

export const adminRoutes: Route[] = [
  { path: 'admin', component: AdminComponent, children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'my-reservations', component: MyReservationsComponent },
    { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  ]},
];


@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
