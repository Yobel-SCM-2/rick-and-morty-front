import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Character } from '../models/character.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los personajes
   */
  getAllCharacters(): Observable<Character[]> {
    return this.http
      .get<Character[]>(`${this.apiUrl}/characters`)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Obtiene los personajes por página
   * @param page Número de página
   */
  getCharactersByPage(page: number): Observable<Character[]> {
    return this.http
      .get<Character[]>(`${this.apiUrl}/characters/page/${page}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Obtiene un personaje por su ID
   * @param id ID del personaje
   */
  getCharacterById(id: number): Observable<Character> {
    return this.http
      .get<Character>(`${this.apiUrl}/characters/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Busca personajes por nombre
   * @param name Nombre del personaje
   */
  searchCharactersByName(name: string): Observable<Character[]> {
    return this.http
      .get<Character[]>(`${this.apiUrl}/characters/search?name=${name}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Maneja errores HTTP
   * @param error Error HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
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
          errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
