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
export class Home {
  courses: CourseModel[] = [];
  filteredCourses: CourseModel[] = [];
  filterValue: string = '';

  constructor(private courseService: CourseService, private router: Router) {}

  // The method ngOnInit() initiate the course table data. Collects in through HttpClient.
  ngOnInit() {
    this.courseService.getCourses().subscribe((courses) => {
      this.courses = courses;
      this.filteredCourses = courses;
    });
  }

  // Sorting parameters
  sortKey: keyof CourseModel | null = 'translatedName';
  sortDirection: 'asc' | 'desc' | null = null;

  /**
   * Handles sorting logic when a column header is clicked
   * If a new column is selected, sorting is set to ascending order
   * If the same column is clicked again, toggles between ascending and descending
   * If clicked a third time, clears sorting entirely
   * Triggers filtering and sorting logic by calling applyFilter().
   * @param column - The key of the column (from CourseModel) to sort by.
   */
  onSort(column: keyof CourseModel): void {
    if (this.sortKey !== column) {
      this.sortKey = column;
      this.sortDirection = 'asc';
    } else {
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else if (this.sortDirection === 'desc') {
        this.sortKey = null;
        this.sortDirection = null;
      } else {
        this.sortDirection = 'asc';
      }
    }

    this.applyFilter(); //
  }

  /**
   * Applies the current text filter and sorting rules to the full course list
   * Filters courses based on a text query (filterValue), matching either the course code or course name
   * If a sort key and direction are set, sorts the filtered list accordingly
   * The result is stored in filteredCourses
   */
  applyFilter(): void {
    const query = this.filterValue.toLowerCase();

    let result = this.courses.filter(
      (course: CourseModel) =>
        course.code.toLowerCase().includes(query) ||
        course.translatedName.toLowerCase().includes(query)
    );

    if (this.sortKey && this.sortDirection) {
      result = result.sort((a, b) => {
        const aVal = (a[this.sortKey!] ?? '').toString().toLowerCase();
        const bVal = (b[this.sortKey!] ?? '').toString().toLowerCase();
        return this.sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }

    this.filteredCourses = result; // Sorted and filtered result
  }
}
