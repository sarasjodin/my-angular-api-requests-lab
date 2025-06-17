import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { CourseModel } from '../interfaces/course-model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private remoteUrl = 'https://webbutveckling.miun.se/files/ramschema.json';
  private localUrl = '/ramschema.json'; // Local file with transated course name

  constructor(private http: HttpClient) {}

  getCourses(): Observable<CourseModel[]> {
    // Load both lists in parallell
    const remote$ = this.http.get<CourseModel[]>(this.remoteUrl);
    const local$ = this.http.get<CourseModel[]>(this.localUrl);

    return forkJoin([remote$, local$]).pipe(
      map(([remoteCourses, localCourses]) => {
        // Match each remote course and local course
        return remoteCourses.map((remote) => {
          const localMatch = localCourses.find((l) => l.code === remote.code);
          return {
            ...remote,
            translatedName: localMatch?.translatedName ?? remote.coursename,
          };
        });
      }),
      catchError((error) => {
        console.warn('Remote unsuccessful. Using local json.', error);
        return this.http.get<CourseModel[]>(this.localUrl);
      })
    );
  }
}
