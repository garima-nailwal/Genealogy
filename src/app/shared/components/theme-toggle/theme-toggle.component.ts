import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})

export class ThemeToggleComponent implements OnInit {
  isDark: boolean = false;
  mounted: boolean = false;

  ngOnInit(): void {
    // Detect initial theme from localStorage or default
    const theme = localStorage.getItem('theme') || 'light';
    this.isDark = theme === 'dark';
    this.setTheme(this.isDark ? 'dark' : 'light');
    this.mounted = true;
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    this.setTheme(this.isDark ? 'dark' : 'light');
  }

  setTheme(theme: string): void {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }
}

