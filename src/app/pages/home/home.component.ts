import {Component, ElementRef, inject, ViewEncapsulation} from '@angular/core';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {OlympicService} from "../../core/services/olympic.service";
import {interval, Observable} from "rxjs";
import {delay, filter, map, take, tap} from "rxjs/operators";
import {Participation} from "../../core/models/Participation";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faAward, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {Router} from "@angular/router";
import {Olympic} from "../../core/models/Olympic";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {StatElementComponent} from "../../core/templates/stat-element/stat-element.component";
import {HeaderComponent} from "../../core/templates/header/header.component";
import {StatusComponent} from "../../core/templates/status/status.component";

@Component({
  selector: 'app-chart-test',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgxChartsModule,
    FaIconComponent,
    StatElementComponent,
    HeaderComponent,
    StatusComponent
  ],
})
export class HomeComponent {
  private router: Router = inject(Router);
  private olympicService: OlympicService = inject(OlympicService);
  private elementRef: ElementRef = inject(ElementRef);

  loading$: Observable<boolean> = this.olympicService.loading$;
  dataRetrievalError$ : Observable<{msg: string, details: Error} | null> = this.olympicService.errors$;
  olympicCount: number = 0;
  countryCount: number = 0;

  olympics$: Observable<{ name: string; value: number }[]> = this.olympicService.olympics$.pipe(
    // Prevent 'Angular Expression has changed after it was checked'
    delay(0),
    takeUntilDestroyed(),
    filter((olympics: Olympic[]) => olympics !== undefined),
    tap((olympics: Olympic[]) => {
      this.countryCount = olympics.length;
      const uniqueYears:{[year: number]: null} = olympics
        .reduce((part: Participation[], o: Olympic) => {
          return part.concat(o.participations);
        }, [])
        .reduce((years: {[year: number]: null}, current:Participation) => {
          years[current.year] = null;
          return years
        }, {});
      this.olympicCount = Object.keys(uniqueYears).length;
    }),
    map((olympics: Olympic[]) => olympics.map(country => {
      return {name: country.country, value: country.participations.reduce((total: number, participation: Participation) => total + participation.medalsCount, 0)}
    })),
    tap({next:
        () => interval(100).pipe(take(1)).subscribe({complete: () => this.spaceCountryText()})
    })
  );

  title: string = "Medals per Country";
  chartSize: [number, number] = [window.innerWidth * 0.8, window.innerHeight * 0.6];
  protected readonly faAward: IconDefinition = faAward;

  onSelect(data: {name: string, value: number}): void {
    const url: string = encodeURI('country/' + data.name);
    // Irrelevant country names are handled by country-detail.component by a redirection, no need to implement then() here
    this.router.navigateByUrl(url).then();
  }

  onResize() {
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.6;
    this.chartSize = [width, height];
  }

  private spaceCountryText() {
    const textElements = this.elementRef.nativeElement.querySelectorAll('[ngx-charts-pie-label] g');
    if(textElements.length == 0) return;

    // Searching for translate3d('Xpx', 'Ypx', 'Zpx') CSS inline directive used by ngx-charts-pie-label element
    const regex = /([+-]?\d*\.?\d+)(?=px)/g;
    textElements.forEach((text: HTMLElement) => {
      const match = text.style.transform.match(regex);
      if(!!match && match.length !== 0) {
        // If translate x is positive we add some more space, else we subtract
        +match[0] > 0 ? match[0] = (+match[0] + 10).toString()
                      : match[0] = (+match[0] - 10).toString();
        text.style.transform = 'translate3d(' +match.join('px, ') + ')';
      }
   });
  }
}
