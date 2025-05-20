import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMessageComponent } from './create-message.component';

describe('CreateMessageComponent', () => {
  let component: CreateMessageComponent;
  let fixture: ComponentFixture<CreateMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
