import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-companies',
  standalone: true,
  templateUrl: './companies.component.html',
  imports: [
    RouterLink
  ],
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent {

}
