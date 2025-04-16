import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private router: Router) {}

  /**
   * Navega a la página de inicio
   */
  goHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Navega a la página de búsqueda
   */
  goToSearch(): void {
    this.router.navigate(['/search']);
  }
}
