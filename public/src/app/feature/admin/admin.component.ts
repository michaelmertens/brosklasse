import { Component, OnInit } from '@angular/core';
import { AdminUser, AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public adminUser: AdminUser;

  constructor(
    private auth: AuthService,
  ) { }

  ngOnInit() {
    if (!this.auth.isAdmin()) {
      window.location.href = 'https://www.hypnosisdownloads.com/sites/www.hypnosisdownloads.com/files/product-images/imposter-syndrome.jpg';
    }

    this.adminUser = this.auth.getAdminUser();
  }

  saveAdmin(name: string): void {
    if (!name) return;
    this.auth.saveAdminUser(name);
    this.adminUser = name;
  }
}
