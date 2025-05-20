import { TestBed } from '@angular/core/testing';

import { MenuToggleService } from './menu-toggle.service';

describe('MenuToggleService', () => {
  let service: MenuToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
