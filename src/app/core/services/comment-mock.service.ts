import { Injectable } from '@angular/core';

import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentMockService {

  public comments = [
    new Comment('Galina', 'first', new Date(), 2),
  ];
  constructor() {
  }
}
