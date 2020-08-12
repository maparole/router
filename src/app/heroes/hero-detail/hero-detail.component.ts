import { switchMap, take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';

import { HeroService } from '../hero.service';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  hero$: Observable<Hero>;
  incr: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: HeroService
  ) {}


  ngOnInit() {
    this.incr = this.route.snapshot.params.incr;
    this.hero$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.service.getHero(params.get('id')))
    );
    this.router.events.subscribe(event => {
      event instanceof NavigationEnd && console.log(event);
    });
  }

  increment() {
      let incr = this.route.snapshot.params.incr;
      incr = incr ? +incr + 1 : 1;
      let double = incr * 2;
      this.incr = incr;
      console.log(incr) ;
      setTimeout(() =>  {
        this.router.navigate([this.router.url.split(';')[0], { incr, double }], {replaceUrl:true});
      });
  }

  removeInc() {
    this.incr = undefined;
    let double = this.route.snapshot.params.double;
    setTimeout(() =>  {
      this.router.navigate([this.router.url.split(';')[0], {double}], {replaceUrl:true});
    });
  }

  gotoHeroes(hero: Hero) {
    const heroId = hero ? hero.id : null;
    // Pass along the hero id if available
    // so that the HeroList component can select that hero.
    // Include a junk 'foo' property for fun.
    this.router.navigate(['/superheroes', { id: heroId, foo: 'foo' }]);
  }
}
