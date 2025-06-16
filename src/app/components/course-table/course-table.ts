import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseModel } from '../../interfaces/course-model';

@Component({
  standalone: true,
  selector: 'app-course-table',
  imports: [CommonModule],
  templateUrl: './course-table.html',
  styleUrls: ['./course-table.scss'],
})
export class CourseTable {
  // Angular declaration that allows a component to receive data from its parents through "property binding"
  // Array of CourseModel object where the parent sends a list of courses to show in a table
  @Input() courses: CourseModel[] = [];
  // A key from CourseModel (course code, name, etc...or null). Decides which column should sort the table
  @Input() sortKey: keyof CourseModel | null = null;
  // Decide the sorting direction- descending, ascending or null
  @Input() sortDirection: 'asc' | 'desc' | null = null;
  // It defines an event emitter that the component can use to communicate upwards to its parent component
  // https://blog.angular-university.io/angular-output/
  @Output() sortRequest = new EventEmitter<keyof CourseModel>();

  // A method which is called when a column header is clicked
  // It takes a column name and then it emits that column name using this.sortRequest, which is an @Output() event
  setSort(column: keyof CourseModel) {
    this.sortRequest.emit(column);
  }

  // This method returns a icon as a string to show next to a column header based on the sort state
  getSortIcon(column: keyof CourseModel): string {
    if (this.sortKey !== column) return '→';
    return this.sortDirection === 'asc'
      ? '↑'
      : this.sortDirection === 'desc'
      ? '↓'
      : '→';
  }
}
