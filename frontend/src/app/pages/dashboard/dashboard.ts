import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  documents: any[] = [];
  activeMenu: string | null = null;

  /* Share */
  showShareBox = false;
  selectedDocId = '';
  shareEmail = '';
  shareAccess = 'viewer';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments() {
    this.http.get<any[]>('http://localhost:5000/api/documents/my')
      .subscribe(res => this.documents = res);
  }

  /* 🔥 OPEN FILE */
  openFile(filePath: string) {
    const url = 'http://localhost:5000/' + filePath;
    window.open(url, '_blank');
  }

  /* MENU */
  toggleMenu(id: string) {
    this.activeMenu = this.activeMenu === id ? null : id;
  }

  /* DELETE */
  deleteDocument(id: string) {
    this.http.delete(`http://localhost:5000/api/documents/${id}`)
      .subscribe(() => this.loadDocuments());
  }

  /* SHARE */
  openShare(id: string) {
    this.selectedDocId = id;
    this.showShareBox = true;
    this.activeMenu = null;
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
      }
    ).subscribe({
      next: (res: any) => {
        alert(`Link:\n${res.link}`);
        this.cancelShare();
      },
      error: () => alert('Share failed')
    });
  }
}