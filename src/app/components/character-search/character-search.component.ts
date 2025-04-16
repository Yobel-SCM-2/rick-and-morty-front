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
  private isSearchingById = false;

  constructor(
    private characterService: CharacterService,
    private errorHandler: ErrorHandlerService,
    private pdfService: PdfService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupNameSearch();
    this.handleUrlParams();
  }

  private setupNameSearch(): void {
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
        error: () => {
          this.characters = [];
          this.searching = false;
          this.error = true;
          this.errorMessage = 'No se encontraron personajes con ese nombre';
        },
      });
  }

  private handleUrlParams(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['name'] && params['name'] !== this.searchControl.value) {
        this.searchControl.setValue(params['name']);
        this.search(params['name']);
      } else if (params['id'] && !isNaN(+params['id'])) {
        if (!this.isSearchingById) {
          this.idSearchControl.setValue(params['id']);
          this.searchById(+params['id']);
        } else {
          this.isSearchingById = false;
        }
      }
    });
  }

  search(term: string): void {
    this.searchTerms.next(term);
    this.updateQueryParams({ name: term, id: null });
  }

  onSearchById(event: Event): void {
    const id = Number(this.idSearchControl.value);

    if (id && !isNaN(id)) {
      this.isSearchingById = true;
      this.updateQueryParams({ id: id.toString(), name: null });
      this.searchById(id);
    }
  }

  searchById(id: number): void {
    this.loading = true;
    this.error = false;
    this.characters = [];
    this.selectedCharacter = null;

    this.characterService.getCharacterById(id).subscribe({
      next: (character) => {
        this.selectedCharacter = character;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.error = true;
        this.errorMessage = 'No se encontró ningún personaje con ese ID';
        this.errorHandler.handleError(error, false);
      },
    });
  }

  selectCharacter(character: Character): void {
    this.selectedCharacter = character;
  }

  downloadPDF(): void {
    if (this.selectedCharacter && this.selectedCharacterContent) {
      this.pdfService.generatePDFFromHTML(
        this.selectedCharacterContent,
        this.selectedCharacter
      );
    }
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.idSearchControl.setValue('');
    this.characters = [];
    this.selectedCharacter = null;
    this.error = false;
    this.updateQueryParams({ name: null, id: null });
  }

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

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
