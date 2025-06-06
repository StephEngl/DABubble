import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordsComponent } from './passwords.component';

describe('PasswordsComponent', () => {
  let component: PasswordsComponent;
  let fixture: ComponentFixture<PasswordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
