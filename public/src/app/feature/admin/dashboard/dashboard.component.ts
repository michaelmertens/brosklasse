import { Component, OnInit } from '@angular/core';
import { AdminUser, AuthService } from '../../../core/services/auth.service';
import { RegistrationService } from '../../../core/services/registration.service';
import { finalize } from 'rxjs/operators';
import { IRegistrationTO } from '../../../../api-contracts/registration';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public adminUser: string;
  public adminUserInput: string;

  public isReserving: boolean;
  public email: string;
  public results: { reservedFor: string, email?: string, code: string }[] = [];

  constructor(
    private auth: AuthService,
    private registrationService: RegistrationService,
  ) { }

  ngOnInit() {
    if (!this.auth.isAdmin()) {
      window.location.href = 'https://www.hypnosisdownloads.com/sites/www.hypnosisdownloads.com/files/product-images/imposter-syndrome.jpg';
    }

    this.initialize();
  }

  saveAdmin(name: string): void {
    if (!name) return;
    this.auth.saveAdminUser(name);

    this.initialize();
  }

  initialize(): void {
    this.adminUser = this.auth.getAdminUser();

    if (this.adminUser) {
      this.registrationService.getAllReservationsBy(this.adminUser).subscribe((list: IRegistrationTO[]) => {
        this.results = list.map((r) => {
          return {
            code: r.code,
            email: r.email,
            reservedFor: r.reservedFor,
          };
        });
      })
    }
  }

  makeReservation(email: string): void {
    if (!email) return;

    this.isReserving = true;
    this.registrationService.reserveNewCode(this.email).pipe(
      finalize(() => this.isReserving = false)
    ).subscribe((reservation: IRegistrationTO) => {
      this.results.push({code: reservation.code, reservedFor: reservation.reservedFor });
    });
  }
}
