import {Component, Input} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {Observable} from "rxjs";

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent {
  @Input() loading$!: Observable<boolean>;
  @Input() error$!: Observable<{msg: String, details: Error} | null>;
}
