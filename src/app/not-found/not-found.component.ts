import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
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
