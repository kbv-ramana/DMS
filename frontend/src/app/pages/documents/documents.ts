import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.html',
  styleUrl: './documents.css'
})
export class Documents implements OnInit {

  documents: any[] = [];
  keyword = '';

  showShareBox = false;
  selectedDocId = '';
  shareEmail = '';
  shareAccess = 'viewer';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['keyword']) {
        this.keyword = params['keyword'];
        this.searchDocuments();
      } else {
        this.loadMyDocuments();
      }
    });
  }

  getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  }

  /* 🔥 My Files */
  loadMyDocuments() {
    this.http.get<any[]>(
      'http://localhost:5000/api/documents/my',
      { headers: this.getHeaders() }
    ).subscribe(res => this.documents = res);
  }

  /* 🔥 Shared Files */
  loadSharedDocuments() {
    this.http.get<any[]>(
      'http://localhost:5000/api/documents/shared',
      { headers: this.getHeaders() }
    ).subscribe(res => this.documents = res);
  }

  /* 🔍 Search */
  searchDocuments() {
    if (!this.keyword) return this.loadMyDocuments();

    this.http.get<any[]>(
      `http://localhost:5000/api/documents/search?keyword=${this.keyword}`,
      { headers: this.getHeaders() }
    ).subscribe(res => this.documents = res);
  }

  /* 🗑 Delete */
  deleteDocument(id: string) {
    this.http.delete(
      `http://localhost:5000/api/documents/${id}`,
      { headers: this.getHeaders() }
    ).subscribe(() => {
      alert('Deleted successfully');
      this.loadMyDocuments();
    });
  }

  /* 🔥 Share */
  openShare(id: string) {
    this.selectedDocId = id;
    this.showShareBox = true;
  }

  cancelShare() {
    this.showShareBox = false;
    this.shareEmail = '';
  }

  shareDocument() {
    this.http.post(
      `http://localhost:5000/api/documents/${this.selectedDocId}/share`,
      {
        email: this.shareEmail,
        access: this.shareAccess
      },
      { headers: this.getHeaders() }
    ).subscribe({
      next: (res: any) => {
        alert(`Shared!\nLink: ${res.link}`);
        this.cancelShare();
      },
      error: () => alert('Sharing failed')
    });
  }
}