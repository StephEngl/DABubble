import { TestBed } from '@angular/core/testing';

import { ConversationService } from './conversations.service';

describe('DirectMessagesService', () => {
  let service: ConversationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
