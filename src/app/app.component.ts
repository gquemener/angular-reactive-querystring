import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith, share, flatMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public bacons: Observable<string[]>;
  public count: Observable<number>;
  public limit: FormControl;

  public constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit() {
    this.limit = new FormControl(5);
    this.limit.valueChanges
      .pipe(startWith(5))
      .subscribe((limit: number) => this.router.navigate(['.'], { queryParams: { limit } }));

    this.bacons = this.activatedRoute.queryParams
      .pipe(map(p => p.limit))
      .pipe(filter((limit) => limit))
      .pipe(flatMap(
        (limit: string): Observable<string[]> => {
          return this.http.get<string[]>('https://baconipsum.com/api/?type=meat-and-filler', { params: new HttpParams().set('paras', limit) });
        }
      ))
      .pipe(share());

    this.count = this.bacons
      .pipe(map((bacons) => bacons.length))
      .pipe(startWith(0));
  }
}
