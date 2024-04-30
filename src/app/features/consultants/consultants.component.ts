import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-consultants',
  standalone: true,
    imports: [
        RouterLink
    ],
  templateUrl: './consultants.component.html',
  styleUrl: './consultants.component.scss'
})
export class ConsultantsComponent {

}
