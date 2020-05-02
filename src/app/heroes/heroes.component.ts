import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

//don't need this anymore, changing this component to utilize services
//import { HeroList } from '../mock-heroes';

//@Component is a decorator function that specifies the Angular metadata for the component.
@Component({
  /*
  identifies this component, used to display in other files, 
  check app.component.html for reference
  */
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})

//Always export the component class so you can import it elsewhere
export class HeroesComponent implements OnInit {

  heroes: Hero[];
  
  //not used anymore, the selected hero now leads to another URL
  //selectedHero: Hero;

  /*
  hero: Hero = {
    id: 1, 
    name: 'Windstorm'
  }
  */

  /*
  The parameter simultaneously defines a private heroService 
  property and identifies it as a HeroService injection site.

  When Angular creates a HeroesComponent, the Dependency Injection 
  system sets the heroService parameter to the singleton instance 
  of HeroService
  */
  constructor(private heroService: HeroService, private messageService: MessageService) { }

  /*
  The ngOnInit() is a lifecycle hook. Angular calls ngOnInit() 
  shortly after creating a component. It's a good place to put 
  initialization logic.
  */
  ngOnInit(): void {
    this.getHeroes();
  }

  /*
  //not used anymore, the selected hero now leads to another URL
  onSelect(hero){
    this.selectedHero = hero;

    //${object}, this notation allows you to access the object in a string
    this.messageService.add(`HeroService: Selected hero: ${hero.name}, id=${hero.id}`);
  }
  */

  /*
  The previous version assigns an array of heroes to the component's 
  heroes property. The assignment occurs synchronously, as if the server
  could return heroes instantly or the browser could freeze the UI while 
  it waited for the server's response.

  That won't work when the HeroService is actually making requests of a 
  remote server.

  //old version
  getHeroes(): void {
    this.heroes = this.heroService.getHeroes();
  }

  The new version waits for the Observable to emit the array of heroes, 
  which could happen now or several minutes from now. The subscribe() 
  method passes the emitted array to the callback, which sets the 
  component's heroes property.

  This asynchronous approach will work when the HeroService requests 
  heroes from the server.
  */
  //new verion
  getHeroes(): void{
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  /*
  When the given name is non-blank, the handler creates a Hero-like 
  object from the name (it's only missing the id) and passes it to 
  the services addHero() method

  When addHero() saves successfully, the subscribe() callback 
  receives the new hero and pushes it into to the heroes list for 
  display
  */
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  /*
  Although the component delegates hero deletion to the HeroService, 
  it remains responsible for updating its own list of heroes. The 
  component's delete() method immediately removes the hero-to-delete 
  from that list, anticipating that the HeroService will succeed on 
  the server
  */
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }
}
