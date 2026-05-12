import { AuthService } from '@auth/services/auth.service';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'admin-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard {

  AuthService = inject(AuthService)
  user = computed(() => this.AuthService.user());

 }
