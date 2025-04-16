import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Character } from '../../models/character.model';
import { CharacterService } from '../../services/character.service';
import { PdfService } from '../../services/pdf.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss'],
})
export class CharacterDetailComponent implements OnInit {
  @ViewChild('characterContent')
  characterContent!: ElementRef;
  character: Character | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService,
    private pdfService: PdfService,
    private errorHandler: ErrorHandlerService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadCharacter();
  }

  /**
   * Carga los detalles del personaje
   */
  loadCharacter(): void {
    this.loading = true;
    this.error = false;

    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(+id)) {
      this.characterService.getCharacterById(+id).subscribe({
        next: (data) => {
          this.character = data;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.error = true;
          this.errorHandler.handleError(error);
        },
      });
    } else {
      this.router.navigate(['/not-found']);
    }
  }

  /**
   * Vuelve a la página anterior
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Genera y descarga un PDF con la información del personaje
   */
  downloadPDF(): void {
    if (this.character && this.characterContent) {
      this.pdfService.generatePDFFromHTML(
        this.characterContent,
        this.character
      );
    }
  }

  /**
   * Reintenta cargar el personaje en caso de error
   */
  retryLoading(): void {
    this.loadCharacter();
  }

  /**
   * Extrae el número de episodio de la URL
   * @param episodeUrl URL del episodio
   */
  getEpisodeNumber(episodeUrl: string): string {
    const parts = episodeUrl.split('/');
    return parts[parts.length - 1];
  }
}
