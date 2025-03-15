import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authManagerGuard } from './authManager.guard';

describe('authManagerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authManagerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
