/*
In Angular, the best practice is to load and configure 
the router in a separate, top-level module that is 
dedicated to routing and imported by the root AppModule.

By convention, the module class name is AppRoutingModule 
and it belongs in the app-routing.module.ts in the 
src/app folder
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

/*
array of routes within the application
path: a string that matches the URL in the browser address bar
      can also contain GET information by adding it in with 
      a ":", ex. detail/:id, the colon (:) in the path indicates
      that :id is a placeholder for a specific hero id
component: the component that the router should create when 
           navigating to the specified URL
*/
const routes: Routes = [
  { path: 'heroes', component: HeroesComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },

  /*
  When the app starts, the browser's address bar points to the
  web site's root. That doesn't match any existing route so the 
  router doesn't navigate anywhere. The space below the 
  <router-outlet> is blank.

  This route redirects a URL that fully matches the empty path 
  to the route whose path is '/dashboard'
  */
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, 
]

//The @NgModule metadata initializes the router and starts 
//it listening for browser location changes
@NgModule({
  declarations: [],

  /*
  The following line adds the RouterModule to the AppRoutingModule 
  imports array and configures it with the routes in one step by 
  calling RouterModule.forRoot()

  The method is called forRoot() because you configure the router 
  at the application's root level. The forRoot() method supplies 
  the service providers and directives needed for routing, and 
  performs the initial navigation based on the current browser URL
  */
  imports: [
    CommonModule, 
    RouterModule.forRoot(routes),
  ],

  //AppRoutingModule exports RouterModule so it will be available 
  //throughout the app
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
