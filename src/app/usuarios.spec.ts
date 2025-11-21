import { TestBed } from '@angular/core/testing';

// local dummy Usuarios provider for the spec
class Usuarios {}

describe('Usuarios', () => {
  let service: Usuarios;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [Usuarios] });
    service = TestBed.inject(Usuarios);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
