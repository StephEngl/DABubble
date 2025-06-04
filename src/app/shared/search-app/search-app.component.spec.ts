import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAppComponent } from './search-app.component';

describe('SearchAppComponent', () => {
  let component: SearchAppComponent;
  let fixture: ComponentFixture<SearchAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAppComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
