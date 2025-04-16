import { Component, OnInit } from '@angular/core';
import { Character } from '../../models/character.model';
import { CharacterService } from '../../services/character.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
})
export class CharacterListComponent implements OnInit {
  characters: Character[] = [];
  loading = true;
  error = false;

  // Paginación
  currentPage = 1;
  pageSize = 20;
  totalCharacters = 0;

  constructor(
    private characterService: CharacterService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  /**
   * Carga los personajes desde el servicio
   */
  loadCharacters(): void {
    this.loading = true;
    this.error = false;

    this.characterService.getCharactersByPage(this.currentPage).subscribe({
      next: (data) => {
        this.characters = data;
        this.totalCharacters = data.length > 0 ? 20 * 42 : 0; // Hay 42 páginas en la API
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.error = true;
        this.errorHandler.handleError(error);
      },
    });
  }

  /**
   * Maneja el evento de cambio de página
   * @param event Evento de paginación
   */
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.loadCharacters();
    // Scroll al inicio de la lista
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Reintenta cargar los personajes en caso de error
   */
  retryLoading(): void {
    this.loadCharacters();
  }
}
