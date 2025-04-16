import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Character } from '../../models/character.model';
import { CharacterService } from '../../services/character.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-character-search',
  templateUrl: './character-search.component.html',
  styleUrls: ['./character-search.component.scss'],
})
export class CharacterSearchComponent implements OnInit {
  @ViewChild('selectedCharacterContent')
  selectedCharacterContent!: ElementRef;

  searchControl = new FormControl('');
  idSearchControl = new FormControl('');
  characters: Character[] = [];
  selectedCharacter: Character | null = null;

  loading = false;
  searching = false;
  error = false;
  errorMessage = '';

  private searchTerms = new Subject<string>();
  private isSearchingById: boolean = false;

  constructor(
    private characterService: CharacterService,
    private errorHandler: ErrorHandlerService,
    private pdfService: PdfService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Configurar la búsqueda reactiva por nombre
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((term) => term.length >= 2),
        switchMap((term) => {
          this.searching = true;
          this.error = false;
          return this.characterService.searchCharactersByName(term);
        })
      )
      .subscribe({
        next: (results) => {
          this.characters = results;
          this.searching = false;
        },
        error: (error) => {
          this.characters = [];
          this.searching = false;
          this.error = true;
          this.errorMessage = 'No se encontraron personajes con ese nombre';
          console.error('Error en la búsqueda:', error);
        },
      });

    // Suscribirse a los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      if (params['name'] && params['name'] !== this.searchControl.value) {
        this.searchControl.setValue(params['name']);
        this.search(params['name']);
      } else if (params['id'] && !isNaN(+params['id'])) {
        // Si la búsqueda fue activada intencionalmente, no se vuelve a ejecutar
        if (!this.isSearchingById) {
          this.idSearchControl.setValue(params['id']);
          this.searchById(+params['id']);
        } else {
          this.isSearchingById = false;
        }
      }
    });
  }

  /**
   * Emite un nuevo término de búsqueda
   * @param term Término de búsqueda
   */
  search(term: string): void {
    this.searchTerms.next(term);
    // Actualiza los query parameters solo para la búsqueda por nombre
    this.updateQueryParams({ name: term, id: null });
  }

  /**
   * Maneja el evento del formulario de búsqueda por ID.
   * Se añade el parámetro event y se llama a preventDefault para evitar que se recargue la página.
   */
  // Función que se dispara al hacer submit en el formulario de búsqueda por ID.
  onSearchById(event: Event): void {
    // Evita que el formulario realice el submit predeterminado (recarga la página)
    // event.preventDefault();
    console.log('Evento submit capturado, iniciando búsqueda por ID.');

    // Se obtiene el valor ingresado en el formulario
    const idValue = this.idSearchControl.value;
    console.log('Valor ingresado en idSearchControl:', idValue);

    // Se convierte el valor a número
    const id = Number(idValue);
    if (id && !isNaN(id)) {
      console.log('ID válido recibido:', id);
      // Se marca que la búsqueda por ID se inició desde el formulario,
      // para evitar que la suscripción a queryParams dispare otra búsqueda.
      this.isSearchingById = true;

      // Se actualizan los query params para reflejar el ID en la URL
      this.updateQueryParams({ id: id.toString(), name: null });
      console.log('Query params actualizados con id:', id);

      // Se procede con la búsqueda mediante el servicio
      this.searchById(id);
    } else {
      console.error('El ID ingresado es inválido:', idValue);
    }
  }

  /**
   * Realiza la búsqueda de un personaje por ID llamando al servicio
   * @param id ID del personaje
   */
  // Función que se encarga de llamar al servicio para realizar la búsqueda por ID.
  searchById(id: number): void {
    this.loading = true;
    this.error = false;
    this.characters = [];
    this.selectedCharacter = null;
    console.log('Iniciando búsqueda del personaje con ID:', id);

    this.characterService.getCharacterById(id).subscribe({
      next: (character) => {
        this.selectedCharacter = character;
        this.loading = false;
        console.log('Personaje encontrado:', character);
      },
      error: (error) => {
        this.loading = false;
        this.error = true;
        this.errorMessage = 'No se encontró ningún personaje con ese ID';
        console.error('Error al buscar el personaje:', error);
        this.errorHandler.handleError(error, false);
      },
    });
  }

  /**
   * Selecciona un personaje de la lista
   * @param character Personaje seleccionado
   */
  selectCharacter(character: Character): void {
    this.selectedCharacter = character;
  }

  /**
   * Descarga los detalles del personaje en PDF
   */
  downloadPDF(): void {
    if (this.selectedCharacter && this.selectedCharacterContent) {
      this.pdfService.generatePDFFromHTML(
        this.selectedCharacterContent,
        this.selectedCharacter
      );
    }
  }

  /**
   * Limpia la búsqueda (ambos modos)
   */
  clearSearch(): void {
    this.searchControl.setValue('');
    this.idSearchControl.setValue('');
    this.characters = [];
    this.selectedCharacter = null;
    this.error = false;
    this.updateQueryParams({ name: null, id: null });
  }

  /**
   * Actualiza los parámetros de la URL
   * @param params Parámetros de consulta
   */
  // Función que se encarga de actualizar la URL con los query params
  private updateQueryParams(params: {
    name: string | null;
    id: string | null;
  }): void {
    const queryParams: { [key: string]: string } = {};

    if (params.name) {
      queryParams['name'] = params.name;
    }
    if (params.id) {
      queryParams['id'] = params.id;
    }

    console.log('Actualizando query params:', queryParams);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
