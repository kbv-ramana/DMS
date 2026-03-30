import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  isSidebarOpen = false;
  searchQuery = '';

  profileOpen = false;
  userEmail = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token: any = localStorage.getItem('token');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userEmail = payload.email || 'User';
      } catch {
        this.userEmail = 'User';
      }
    }
  }

  showSidebar(): boolean {
    const hiddenRoutes = ['/login', '/register'];
    return !hiddenRoutes.includes(this.router.url);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/dashboard'], {
        queryParams: { keyword: this.searchQuery }
      });
    }
  }

  goToUpload() {
    this.router.navigate(['/upload']);
  }

  toggleProfile() {
    this.profileOpen = !this.profileOpen;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}