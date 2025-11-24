import { TestBed } from '@angular/core/testing';
import * as mascotas from './mascotas';

describe('Mascotas', () => {
  let service: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject((mascotas as any).Mascotas || (mascotas as any).default || (mascotas as any).MascotasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
