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
  error!: {friendly: string, detail: string};
  showDetails: boolean = false;

  ngOnInit(): void {
    this.error = history.state['error'];
  }

  public showErrorDetail() {
    this.showDetails = !this.showDetails;
  }
}
