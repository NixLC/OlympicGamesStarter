import {Component, inject, OnInit} from '@angular/core';
import {delay, take, tap} from 'rxjs/operators';
import { OlympicService } from './core/services/olympic.service';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet
  ]
})
export class AppComponent implements OnInit {
  title: string = "olympic-games-starter" ;
  olympicService: OlympicService = inject(OlympicService);

  ngOnInit(): void {
    // this.olympicService.loadInitialData().pipe(take(1)).subscribe(
    //   o => console.log('Into app components ' +o)
    // );
  }
}
