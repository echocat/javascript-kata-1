import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import * as CTJ from 'csvtojson';
import { Author, Book, Literature, Magazine } from './models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private hydrateAuthors = map<any, any>(
    ([literature, authors]: [{ authors: string }[], Author[]]) => {
      return literature.map((literature) => {
        return {
          ...literature,
          authors: literature.authors
            .split(',')
            .map((email) => authors.find((a) => a.email === email)),
        };
      });
    }
  );

  constructor(private http: HttpClient) {}

  fetchBooks(): Observable<Book[]> {
    return combineLatest([
      this.fetchRawCSV<Book>('/assets/data/books.csv'),
      this.fetchAuthors(),
    ]).pipe(this.hydrateAuthors);
  }

  fetchMagazines(): Observable<Magazine[]> {
    return combineLatest([
      this.fetchRawCSV<Magazine>('/assets/data/magazines.csv'),
      this.fetchAuthors(),
    ]).pipe(this.hydrateAuthors);
  }

  fetchAuthors(): Observable<Author[]> {
    return this.fetchRawCSV<Author>('/assets/data/authors.csv');
  }

  fetchLiteratures() {
    return combineLatest([this.fetchBooks(), this.fetchMagazines()]).pipe(
      map(([books, magazines]: [Literature[], Literature[]]) =>
        books.concat(magazines)
      )
    );
  }

  private fetchRawCSV<T>(url: string): any {
    return this.http
      .get(url, {
        responseType: 'text',
      })
      .pipe(
        switchMap((csv) => {
          return CTJ({ delimiter: ';' }).fromString(csv);
        })
      );
  }
}
