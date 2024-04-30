import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.scss'
})
export class IndexPageComponent implements OnInit{
  private router = inject(Router);

  ngOnInit() {
    this.router.navigate(['/companies'], {replaceUrl: true})
  }
}
