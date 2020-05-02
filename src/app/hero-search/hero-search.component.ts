/*
Remember that the component class does not subscribe 
to the heroes$ observable. That's the job of the 
AsyncPipe in the template
*/

import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.css' ]
})
export class HeroSearchComponent implements OnInit {

  //Notice the declaration of heroes$ as an Observable
  heroes$: Observable<Hero[]>;

  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  /*
  A Subject is both a source of observable values and an 
  Observable itself. You can subscribe to a Subject as you 
  would any Observable.

  You can also push values into that Observable by calling 
  its next(value) method as the search() method does

  Push a search term into the observable stream.
  */
  search(term: string): void {
    this.searchTerms.next(term);
  }

  /*
  Passing a new search term directly to the searchHeroes() 
  after every user keystroke would create an excessive amount 
  of HTTP requests, taxing server resources and burning through 
  data plans.

  Instead, the ngOnInit() method pipes the searchTerms observable 
  through a sequence of RxJS operators that reduce the number 
  of calls to the searchHeroes(), ultimately returning an 
  observable of timely hero search results (each a Hero[])
  */
  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      /*
      waits until the flow of new string events pauses for 300 
      milliseconds before passing along the latest string

      wait 300ms after each keystroke before considering the term
      */
      debounceTime(300),

      /*
      ensures that a request is sent only if the filter text changed

      ignore new term if same as previous term
      */
      distinctUntilChanged(),

      /*
      calls the search service for each search term that makes it 
      through debounce() and distinctUntilChanged(). It cancels and 
      discards previous search observables, returning only the latest 
      search service observable

      With the switchMap operator, every qualifying key event can 
      trigger an HttpClient.get() method call. Even with a 300ms pause 
      between requests, you could have multiple HTTP requests in flight 
      and they may not return in the order sent.

      switchMap() preserves the original request order while returning 
      only the observable from the most recent HTTP method call. Results 
      from prior calls are canceled and discarded

      switch to new search observable each time the term changes
      */
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }
}