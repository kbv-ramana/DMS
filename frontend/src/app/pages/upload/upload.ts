import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './upload.html',
  styleUrl: './upload.css'
})
export class Upload {

  title = '';
  tags = '';
  selectedFile: File | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {
    const formData = new FormData();

    formData.append('title', this.title);
    formData.append('tags', this.tags);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post(
      'http://localhost:5000/api/documents/upload',
      formData,
      { headers }
    ).subscribe({
      next: () => {
        alert('Upload successful');
        this.router.navigate(['/documents']);
      },
      error: (err) => {
        console.error(err);
        alert('Upload failed');
      }
    });
  }
}