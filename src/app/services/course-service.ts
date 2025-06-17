import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { CourseModel } from '../interfaces/course-model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private remoteUrl = 'https://webbutveckling.miun.se/files/ramschema.json';
  private localUrl = '/ramschema.json';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<CourseModel[]> {
    // Remote url
    return this.http.get<CourseModel[]>(this.remoteUrl).pipe(
      catchError((error) => {
        console.warn(
          'External URL could not be read. Looking for a local copy.',
          error
        );
        // Local json file
        return this.http.get<CourseModel[]>(this.localUrl);
      })
    );
  }
}
