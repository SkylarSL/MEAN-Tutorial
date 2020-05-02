import { Injectable } from '@angular/core';
import { Hero } from './hero';

//no longer need this as heroes will be obtaines via a mock server
//import { HeroList } from './mock-heroes';

import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

/*
The HeroService could get hero data from anywhere—a 
web service, local storage, or a mock data source.
Removing data access from components means you can 
change your mind about the implementation anytime, 
without touching any components. They don't know how 
the service works
*/

/*
You must make the HeroService available to the dependency 
injection system before Angular can inject it into the HeroesComponent 
by registering a provider. A provider is something that can create or 
deliver a service; in this case, it instantiates the HeroService class 
to provide the service.

To make sure that the HeroService can provide this service, register it 
with the injector, which is the object that is responsible for choosing 
and injecting the provider where the app requires it.

By default, the Angular CLI command ng generate service registers a 
provider with the root injector for your service by including provider 
metadata, that is providedIn: 'root' in the @Injectable() decorator.

When you provide the service at the root level, Angular creates a single, 
shared instance of HeroService and injects into any class that asks for it. 
Registering the provider in the @Injectable metadata also allows Angular 
to optimize an app by removing the service if it turns out not to be used 
after all
*/

/*
The @Injectable marks the class as one that participates 
in the dependency injection system. The HeroService 
class is going to provide an injectable service, 
and it can also have its own injected dependencies.
The @Injectable() decorator accepts a metadata object for 
the service, the same way the @Component() decorator did for 
your component classes
*/
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /*
  This is a typical "service-in-service" scenario: you inject the 
  MessageService into the HeroService which is injected into the 
  HeroesComponent
  */
  constructor(
    private messageService: MessageService, 
    private http: HttpClient,
  ) { }

  getHeroes(): Observable<Hero[]> {
    
    //send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes');

    //old version does not use http requests
    /*
    of(HEROES) returns an Observable<Hero[]> that emits a 
    single value, the array of mock heroes
    */
    //return of(HeroList);
    
    //new version gets heros via http request
    /*
    HttpClient.get() returns the body of the response as an 
    untyped JSON object by default. Applying the optional type 
    specifier, <Hero[]> , adds TypeScript capabilities, which 
    reduce errors during compile time.

    The server's data API determines the shape of the JSON data. 
    The Tour of Heroes data API returns the hero data as an array

    To catch errors, you "pipe" the observable result from http.get() 
    through an RxJS catchError() operator

    The catchError() operator intercepts an Observable that failed. 
    It passes the error an error handler that can do what it wants 
    with the error.

    The following handleError() method reports the error and then 
    returns an innocuous result so that the application keeps working

    The HeroService methods will tap into the flow of observable 
    values and send a message, via the log() method, to the message 
    area at the bottom of the page.

    They'll do that with the RxJS tap() operator, which looks at the 
    observable values, does something with those values, and passes 
    them along. The tap() call back doesn't touch the values themselves
    */
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  /*
  Like getHeroes(), getHero() has an asynchronous signature. 
  It returns a mock hero as an Observable, using the RxJS of() 
  function.
  You'll be able to re-implement getHero() as a real Http 
  request without having to change the HeroDetailComponent 
  that calls it
  */
  getHero(id: number): Observable<Hero> {

    //old non-http version
    //send the message _after_ fetching the hero
    //this.messageService.add(`HeroService: fetched hero id=${id}`);
    //return of(HeroList.find(hero => hero.id === id));

    //new http version

    //constructs a request URL with the desired hero's id
    //The server should respond with a single hero rather than an array of heroes
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  //PUT: update the hero on the server 
  //uses http.put() to persist the changed hero on the server
  //.put() arguments: .put(the URL, data to be updated, options)
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  //Log a HeroService message with the MessageService
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  // POST: add a new hero to the server 
  addHero(hero: Hero): Observable<Hero> {

    /*
    calls HttpClient.post() instead of put()
    expects the server to generate an id for the new hero, 
    which it returns in the Observable<Hero> to the caller
    */
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero with id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    //delete<variable Type>(the URL, options)
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      //if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found heroes matching "${term}"`) :
         this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  /**
  Handle Http operation that failed.
  Let the app continue.
  param operation - name of the operation that failed
  param result - optional value to return as the observable result

  After reporting the error to the console, the handler constructs 
  a user friendly message and returns a safe value to the app so 
  the app can keep working.

  Because each service method returns a different kind of Observable 
  result, handleError() takes a type parameter so it can return the 
  safe value as the type that the app expects
  */
  private handleError<T>(operation = 'operation', result? : T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
