import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {catchError, delay, filter, map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {Olympic} from "../models/Olympic";

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private http: HttpClient = inject(HttpClient);
  private olympicUrl = './assets/mock/olympic.json';

  private _olympics$: BehaviorSubject<Olympic[]> = new BehaviorSubject<Olympic[]>([]);
  private _errors$: BehaviorSubject<{msg: string, details: Error} | null> = new BehaviorSubject<{msg: string; details: Error} | null>(null);
  private _loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private lastDataLoad: number = 0;

  private loadInitialData(): Observable<Olympic[]> {
    this._loading$.next(true);

    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      // Simulate some network delay
      delay(800),
      tap((value) => {
          this.lastDataLoad = Date.now();
          this._olympics$.next(value);
          this._loading$.next(false);
        }
      ),
      catchError((error) => {
        this._olympics$.next([]);
        this._loading$.next(false);
        return throwError({msg: "An error occurred during data retrieval", details: error});
      })
    );
  }

  get olympics$(): Observable<Olympic[]> {
    if(this.lastDataLoad === 0){
      this.loadInitialData().subscribe({error:(e) => this._errors$.next(e)});
    }
    return this._olympics$.pipe(
      filter((olympics: Olympic[]) => olympics.length > 0)
    );
  }

  refreshData(dataFreshnessInSeconds:number) {
    if(dataFreshnessInSeconds >= 0 && dataFreshnessInSeconds < this.getDataFreshnessInSeconds()) {
      this.loadInitialData().subscribe({error:(e) => this._errors$.next(e)});
    }
  }

  get errors$(): Observable<{msg: string, details: Error} | null> {
    return this._errors$.asObservable();
  }

  clearErrors(): void {
    this._errors$.next(null);
  }

  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private getDataFreshnessInSeconds() {
    return (Date.now() - this.lastDataLoad) / 1000;
  }

  getOlympic(countryName: string): Observable<Olympic> {
    const filterOlympicsByCountry = (o: Olympic) => o.country === countryName;
    return this.olympics$.pipe(
      map((olympics: Olympic[]) => olympics.filter(filterOlympicsByCountry)[0]),
      switchMap((olympic: Olympic) => {
        if (!olympic) {
          const e = new Error(`No data found for country '${countryName}'`);
          return throwError(e);
        }
        else {
          return of(olympic);
        }
      }),
      shareReplay(1),
      catchError(e => {
        // Rethrow the error so it can be caught by subscribers
        return throwError(new Error(`Error fetching data : ${e.message}`));
      })
    );
  }

}
