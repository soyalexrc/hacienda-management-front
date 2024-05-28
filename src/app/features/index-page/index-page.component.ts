import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.scss'
})
export class IndexPageComponent implements OnInit{
  private router = inject(Router);
  private auth = inject(AuthService);

  private readonly user = this.auth.getCurrentUser;

  ngOnInit() {
    switch (this.user.mainUser.roleID) {
      case 0:
        this.router.navigate(['/companies'], {replaceUrl: true})
        break
      case 1:
        // this.router.navigate(['/consultants'], {replaceUrl: true})
        this.router.navigate(['/devices'], {replaceUrl: true})
        break
      case 2:
        this.router.navigate(['/devices'], {replaceUrl: true})
        break
      case 3:
        this.router.navigate(['/devices'], {replaceUrl: true})
        break
      default:
        this.router.navigate(['/companies'], {replaceUrl: true})
    }
  }
}
