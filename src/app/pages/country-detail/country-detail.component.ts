import {Component, inject, ViewEncapsulation} from '@angular/core';
import {OlympicService} from "../../core/services/olympic.service";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {Observable, throwError} from "rxjs";
import {Olympic} from "../../core/models/Olympic";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {catchError, delay, filter, map, tap} from "rxjs/operators";
import {Participation} from "../../core/models/Participation";
import {StatElementComponent} from "../../core/templates/stat-element/stat-element.component";
import {HeaderComponent} from "../../core/templates/header/header.component";
import {StatusComponent} from "../../core/templates/status/status.component";
import {faAward, faRunning, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgxChartsModule,
    StatElementComponent,
    HeaderComponent,
    StatusComponent,
    FaIconComponent
  ]
})
export class CountryDetailComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private olympicService: OlympicService = inject(OlympicService);
  loading$: Observable<boolean> = this.olympicService.loading$;
  dataRetrievalError$ : Observable<{msg: String, details: Error} | null> = this.olympicService.errors$;
  medalsCount: number = 0;
  athletesCount: number = 0;
  entriesCount: number = 0;

  country$: Observable<{name: string, series:{name: string, value: number, extra:{city: string, athleteCount: number}}[]}[]> = this.olympicService.getOlympic(this.route.snapshot.params['country']).pipe(
    delay(0),
    takeUntilDestroyed(),
    catchError((e: Error) => {
      this.go404({state: { error: e.message}});
      this.olympicService.clearErrors();
      return throwError(e);
    }),
    filter((o:Olympic) => o !== undefined),
    tap((o:Olympic) => {
      this.title = o.country;
      this.medalsCount = o.participations.reduce((totalMedals: number, p:Participation) => totalMedals + p.medalsCount, 0);
      this.athletesCount = o.participations.reduce((totalAthletes: number, p:Participation) => totalAthletes + p.athleteCount, 0);
      this.entriesCount = o.participations.length;
    }),
    map((o:Olympic) => {
      return [{
        name: o.country,
        series: o.participations.map(p => ({name: p.year.toString(), value: p.medalsCount, extra: {city: p.city, athleteCount: p.athleteCount}}))
      }];
    })
  );

  title!: string;
  chartSize: [number, number] = [window.innerWidth * 0.6, window.innerHeight * 0.6];
  xAxisLabel: string = 'Dates';
  yAxisLabel: string = 'Médailles';
  protected readonly faAward: IconDefinition = faAward;
  protected readonly faRunning = faRunning;

  onResize() {
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.6;
    this.chartSize = [width, height];
  }

  onSelect(event: any) {
    console.log(event);
  }

  go404(extras: NavigationExtras): void {
    this.router.navigateByUrl('notfound', extras);
  }

  goHome(): void {
    this.router.navigateByUrl('').then();
  }

  // Prevent Y axis from showing decimals
  public yAxisTickFormattingFn = this.yAxisTickFormatting.bind(this)
  yAxisTickFormatting(value: number) {
    if (value % 1 > 0) return "";
    return value;
  }

}
