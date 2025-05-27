import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetDialogComponent } from './password-reset-dialog.component';

describe('PasswordResetDialogComponent', () => {
  let component: PasswordResetDialogComponent;
  let fixture: ComponentFixture<PasswordResetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordResetDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordResetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
