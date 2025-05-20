import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectMessagesListComponent } from './direct-messages-list.component';

describe('DirectMessagesListComponent', () => {
  let component: DirectMessagesListComponent;
  let fixture: ComponentFixture<DirectMessagesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectMessagesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectMessagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
