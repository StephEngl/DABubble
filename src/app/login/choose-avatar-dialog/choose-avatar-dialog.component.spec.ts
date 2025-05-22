import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseAvatarDialogComponent } from './choose-avatar-dialog.component';

describe('ChooseAvatarDialogComponent', () => {
  let component: ChooseAvatarDialogComponent;
  let fixture: ComponentFixture<ChooseAvatarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseAvatarDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChooseAvatarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
