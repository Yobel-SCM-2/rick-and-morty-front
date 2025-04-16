import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private snackBar: MatSnackBar, private router: Router) {}

  /**
   * Maneja errores HTTP y muestra mensajes apropiados al usuario
   * @param error Error HTTP
   * @param redirectToHome Indica si se debe redirigir a la página principal
   */
  handleError(
    error: HttpErrorResponse | Error,
    redirectToHome: boolean = false
  ): void {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 404:
          errorMessage = 'No se encontró el recurso solicitado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        case 0:
          errorMessage =
            'No se pudo conectar con el servidor. Verifica tu conexión a internet';
          break;
        default:
          errorMessage = `Error: ${error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Mostrar mensaje de error
    this.snackBar.open(errorMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });

    // Redirigir a la página principal si es necesario
    if (redirectToHome) {
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    }

    // Registrar el error en la consola
    console.error('Error:', error);
  }
}
