import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import {HomeComponent} from "./pages/home/home.component";
import {CountryDetailComponent} from "./pages/country-detail/country-detail.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'country/:country',
    component: CountryDetailComponent
  },
  {
    path: 'notfound',
    component: NotFoundComponent
  },
  {
    path: '**', // wildcard
    redirectTo: '/notfound',
  }
];
