/*
This component simply receives a hero object through its hero 
property and displays it.

@Input() and @Output() allow Angular to share data between the parent 
context and child directives or components. An @Input() property is 
writable while an @Output() property is observable.

the heroDetails component is the child component, while the heroes 
component is the parent component 
*/

//Amend the @angular/core import statement to include the Input symbol.
import { Component, OnInit, Input } from '@angular/core';

//gets the Hero attributes and object
import { Hero } from '../hero';

/*
The ActivatedRoute holds information about the route to this 
instance of the HeroDetailComponent. This component is interested 
in the route's parameters extracted from the URL. The "id" 
parameter is the id of the hero to display
*/
import { ActivatedRoute } from '@angular/router';

/*
The location is an Angular service for interacting with the browser. 
You'll use it later to navigate back to the view that navigated here
*/
import { Location } from '@angular/common';

/*
The HeroService gets hero data from the remote server and this 
component will use it to get the hero-to-display
*/
import { HeroService }  from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {


  /*
  The hero property must be an Input property, annotated 
  with the @Input() decorator, because the external 
  HeroesComponent will bind to it like this.
  */

  //Add a hero property, preceded by the @Input() decorator.
  @Input() selectedHeroDetails: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {

    /*
    The route.snapshot is a static image of the route information 
    shortly after the component was created
    The paramMap is a dictionary of route parameter values extracted 
    from the URL. The "id" key returns the id of the hero to fetch
    Route parameters are always strings. The JavaScript (+) operator 
    converts the string to a number, which is what a hero id should be
    */
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => this.selectedHeroDetails = hero);
  }

  /*
  a goBack() method that navigates backward one step in the browser's 
  history stack using the Location service that you injected previously
  */
  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.heroService.updateHero(this.selectedHeroDetails)
      .subscribe(() => this.goBack());
  }

}
