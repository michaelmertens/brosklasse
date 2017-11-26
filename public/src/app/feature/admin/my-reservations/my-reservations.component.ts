import { Component, OnInit } from '@angular/core';
import { IRegistrationTO } from '../../../../api-contracts/registration';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { RegistrationService } from '../../../core/services/registration.service';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.scss']
})
export class MyReservationsComponent implements OnInit {

  public adminUser: string;
  public adminUserInput: string;

  public isReserving: boolean;
  public email: string;
  public results: IRegistrationTO[] = [];

  constructor(
    private auth: AuthService,
    private registrationService: RegistrationService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData(): void {
    const adminUser = this.auth.getAdminUser();

    if (adminUser) {
      this.registrationService.getAllReservationsBy(adminUser).subscribe((list: IRegistrationTO[]) => {
        this.results = list;
      });
    }
  }

  makeReservation(email: string): void {
    if (!email) return;

    this.isReserving = true;
    this.registrationService.reserveNewCode(this.email).pipe(
      finalize(() => this.isReserving = false)
    ).subscribe(() => {
      this.loadData();
    });
  }

}
