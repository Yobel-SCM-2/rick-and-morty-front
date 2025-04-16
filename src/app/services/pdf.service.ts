import { Injectable } from '@angular/core';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Character } from '../models/character.model';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  /**
   * Genera un PDF con la información del personaje
   * @param character Personaje
   */
  generateCharacterPDF(character: Character): void {
    if (!character) {
      console.error('No se puede generar PDF: personaje no válido');
      return;
    }

    // Define columnas correctamente tipadas
    const documentDefinition: TDocumentDefinitions = {
      content: [
        {
          text: 'Detalles del Personaje',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          // Usando estructura correcta para columnas
          columns: [
            {
              // Columna izquierda para información básica
              width: '*',
              text: [
                { text: character.name + '\n', style: 'name' },
                { text: `Status: ${character.status}\n`, style: 'info' },
                { text: `Species: ${character.species}\n`, style: 'info' },
                character.type
                  ? { text: `Type: ${character.type}\n`, style: 'info' }
                  : '',
                { text: `Gender: ${character.gender}\n`, style: 'info' },
                { text: `Origin: ${character.origin.name}\n`, style: 'info' },
                {
                  text: `Location: ${character.location.name}\n`,
                  style: 'info',
                },
                {
                  text: `Created: ${new Date(
                    character.created
                  ).toLocaleDateString()}\n`,
                  style: 'info',
                },
              ],
            },
          ],
        },
        {
          text: 'Episodes',
          style: 'subheader',
          margin: [0, 20, 0, 10],
        },
        {
          ul: this.formatEpisodes(character.episode),
          style: 'episodes',
        },
        {
          text: 'Image',
          style: 'subheader',
          margin: [0, 20, 0, 10],
        },
        {
          image: character.image,
          width: 200,
          alignment: 'center',
        },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          color: '#2c3e50',
        },
        name: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
          color: '#16a085',
        },
        subheader: {
          fontSize: 16,
          bold: true,
          color: '#2980b9',
        },
        info: {
          fontSize: 12,
          margin: [0, 5, 0, 0],
        },
        episodes: {
          fontSize: 10,
        },
      },
      defaultStyle: {
        font: 'Helvetica',
      },
    };

    // Descargar el PDF
    pdfMake
      .createPdf(documentDefinition)
      .download(`${character.name.replace(/\s+/g, '_')}.pdf`);
  }

  /**
   * Formatea los episodios para mostrarlos en el PDF
   * @param episodes Array de URLs de episodios
   */
  private formatEpisodes(episodes: string[]): string[] {
    return episodes.map((episode) => {
      const episodeId = episode.split('/').pop() || '';
      return `Episode ${episodeId}`;
    });
  }
}
