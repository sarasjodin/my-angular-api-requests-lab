import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { CourseModel } from '../interfaces/course-model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private remoteUrl = 'https://webbutveckling.miun.se/files/ramschema.json';
  private localUrl = '/ramschema.json'; // filen ska ligga i public/

  constructor(private http: HttpClient) {}

  getCourses(): Observable<CourseModel[]> {
    return this.http.get<CourseModel[]>(this.remoteUrl).pipe(
      catchError((error) => {
        console.warn(
          'Extern URL kunde inte läsas – försöker lokal kopia.',
          error
        );
        return this.http.get<CourseModel[]>(this.localUrl);
      })
    );
  }
}
