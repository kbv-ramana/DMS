import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';   // ✅ REQUIRED

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [CommonModule, FormsModule],   // ✅ IMPORTANT
  templateUrl: './share.html'
})
export class Share {

  email = '';
  token = '';
  document: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.token = this.route.snapshot.params['token'];
  }

  verifyAccess() {
    this.http.post('http://localhost:5000/api/documents/share-link', {
      token: this.token,
      email: this.email
    }).subscribe({
      next: (res: any) => this.document = res,
      error: () => alert('Access denied')
    });
  }
}