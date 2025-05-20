import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelHeaderComponent } from './channel-header.component';

describe('ChannelHeaderComponent', () => {
  let component: ChannelHeaderComponent;
  let fixture: ComponentFixture<ChannelHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
