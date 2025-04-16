import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { CharacterListComponent } from './character-list.component';
import { CharacterService } from '../../services/character.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

describe('CharacterListComponent', () => {
  let component: CharacterListComponent;
  let fixture: ComponentFixture<CharacterListComponent>;
  let characterService: CharacterService;
  let errorHandlerService: ErrorHandlerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterListComponent],
      imports: [
        HttpClientTestingModule,
        MatPaginatorModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      providers: [CharacterService, ErrorHandlerService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterListComponent);
    component = fixture.componentInstance;
    characterService = TestBed.inject(CharacterService);
    errorHandlerService = TestBed.inject(ErrorHandlerService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load characters on init', () => {
    const mockCharacters = [
      {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'Earth', url: '' },
        location: { name: 'Earth', url: '' },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        episode: ['https://rickandmortyapi.com/api/episode/1'],
        url: 'https://rickandmortyapi.com/api/character/1',
        created: '2017-11-04T18:48:46.250Z',
      },
    ];

    spyOn(characterService, 'getCharactersByPage').and.returnValue(
      of(mockCharacters)
    );

    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.characters).toEqual(mockCharacters);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
  });

  it('should handle error when loading characters fails', () => {
    const error = new Error('API Error');
    spyOn(characterService, 'getCharactersByPage').and.returnValue(
      throwError(() => error)
    );
    spyOn(errorHandlerService, 'handleError');

    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.loading).toBeFalse();
    expect(component.error).toBeTrue();
    expect(errorHandlerService.handleError).toHaveBeenCalledWith(error);
  });

  it('should change page and reload characters', () => {
    const mockCharacters = [
      {
        id: 2,
        name: 'Morty Smith',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'Earth', url: '' },
        location: { name: 'Earth', url: '' },
        image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
        episode: ['https://rickandmortyapi.com/api/episode/1'],
        url: 'https://rickandmortyapi.com/api/character/2',
        created: '2017-11-04T18:50:21.651Z',
      },
    ];

    spyOn(characterService, 'getCharactersByPage').and.returnValue(
      of(mockCharacters)
    );

    component.onPageChange({ pageIndex: 1, pageSize: 20, length: 100 } as any);

    expect(component.currentPage).toBe(2);
    expect(characterService.getCharactersByPage).toHaveBeenCalledWith(2);
    expect(component.characters).toEqual(mockCharacters);
  });

  it('should retry loading characters', () => {
    spyOn(component, 'loadCharacters');

    component.retryLoading();

    expect(component.loadCharacters).toHaveBeenCalled();
  });
});
