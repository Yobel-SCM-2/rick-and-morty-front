import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { CharacterService } from './character.service';
import { Character } from '../models/character.model';
import { environment } from '../../environments/environment';

describe('CharacterService', () => {
  let service: CharacterService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CharacterService],
    });
    service = TestBed.inject(CharacterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all characters', () => {
    const mockCharacters: Character[] = [
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

    service.getAllCharacters().subscribe((characters) => {
      expect(characters).toEqual(mockCharacters);
    });

    const req = httpMock.expectOne(`${apiUrl}/characters`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacters);
  });

  it('should get a character by id', () => {
    const mockCharacter: Character = {
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
    };

    service.getCharacterById(1).subscribe((character) => {
      expect(character).toEqual(mockCharacter);
    });

    const req = httpMock.expectOne(`${apiUrl}/characters/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacter);
  });

  it('should search characters by name', () => {
    const mockCharacters: Character[] = [
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

    service.searchCharactersByName('Rick').subscribe((characters) => {
      expect(characters).toEqual(mockCharacters);
    });

    const req = httpMock.expectOne(`${apiUrl}/characters/search?name=Rick`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacters);
  });

  it('should handle error when API fails', () => {
    const errorMessage = 'Error al obtener datos de la API';

    service.getAllCharacters().subscribe({
      next: () => fail('debería haber fallado'),
      error: (error) => {
        expect(error.message).toContain(errorMessage);
      },
    });

    const req = httpMock.expectOne(`${apiUrl}/characters`);
    req.error(new ErrorEvent('Network error', { message: errorMessage }));
  });
});
