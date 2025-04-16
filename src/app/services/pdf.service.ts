import { Injectable, ElementRef } from '@angular/core';
import { Character } from '../models/character.model';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import html2canvas from 'html2canvas';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  /**
   * Genera un PDF a partir de un elemento HTML
   * @param element Elemento a capturar
   * @param character Personaje (para el nombre del archivo)
   */
  generatePDFFromHTML(element: ElementRef, character: Character): void {
    if (!element || !character) {
      console.error('No se puede generar PDF: elementos no válidos');
      return;
    }

    const options = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    };

    html2canvas(element.nativeElement, options)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        const documentDefinition: TDocumentDefinitions = {
          content: [
            {
              image: imgData,
              width: 500,
            },
          ],
          pageSize: 'A4',
          pageOrientation: 'portrait',
        };

        pdfMake
          .createPdf(documentDefinition)
          .download(`${character.name.replace(/\s+/g, '_')}.pdf`);
      })
      .catch((error) => {
        console.error('Error al generar el PDF:', error);
      });
  }
}
