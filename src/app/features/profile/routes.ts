import { Routes } from "@angular/router";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";

export const routes: Routes = [
    {path: 'change-password', component: ChangePasswordComponent},
    {path: '', redirectTo: 'change-password', pathMatch: 'full'}
]