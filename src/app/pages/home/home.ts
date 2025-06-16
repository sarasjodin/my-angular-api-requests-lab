import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course-service';
import { CourseModel } from '../../interfaces/course-model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseTable } from '../../components/course-table/course-table';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, FormsModule, CourseTable],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  courses: CourseModel[] = [];
  filteredCourses: CourseModel[] = [];
  filterValue: string = '';

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit() {
    this.courseService.getCourses().subscribe((courses) => {
      this.courses = courses;
      this.filteredCourses = courses;
    });
  }

  sortKey: keyof CourseModel | null = null;
  sortDirection: 'asc' | 'desc' | null = null;

  onSort(column: keyof CourseModel): void {
    if (this.sortKey !== column) {
      this.sortKey = column;
      this.sortDirection = 'asc';
    } else {
      if (this.sortDirection === 'asc') this.sortDirection = 'desc';
      else if (this.sortDirection === 'desc') {
        this.sortKey = null;
        this.sortDirection = null;
        return this.applyFilter();
      } else {
        this.sortDirection = 'asc';
      }
    }

    this.applyFilter();
  }

  getSortIcon(column: keyof CourseModel): string {
    if (this.sortKey !== column) return '→';
    return this.sortDirection === 'asc'
      ? '↑'
      : this.sortDirection === 'desc'
      ? '↓'
      : '→';
  }

  applyFilter(): void {
    const query = this.filterValue.toLowerCase();
    let result = this.courses.filter(
      (course: CourseModel) =>
        course.code.toLowerCase().includes(query) ||
        course.coursename.toLowerCase().includes(query)
    );

    if (this.sortKey && this.sortDirection) {
      result = result.sort((a: CourseModel, b: CourseModel) => {
        const aVal = a[this.sortKey!] as string;
        const bVal = b[this.sortKey!] as string;
        return this.sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }

    this.filteredCourses = result;
  }

  navigateToCourseDetails(courseCode: string): void {
    this.router.navigate(['/courses', courseCode]);
  }
}
