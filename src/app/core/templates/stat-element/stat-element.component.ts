import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-stat-element',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './stat-element.component.html',
  styleUrl: './stat-element.component.scss'
})
export class StatElementComponent {
  @Input() elementTitle!: string;
  @Input() elementValue!: string | number;
}
