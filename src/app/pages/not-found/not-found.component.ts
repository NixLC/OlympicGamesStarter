import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {StatusComponent} from "../../core/templates/status/status.component";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  standalone: true,
  styleUrls: ['./not-found.component.scss'],
  imports: [
    RouterLink,
    StatusComponent
  ]
})
export class NotFoundComponent implements OnInit {
  errors!: string;

  ngOnInit(): void {
    this.errors = history.state['error'];
  }
}
