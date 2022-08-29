import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { concatMap, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private readonly http: HttpClient) {}

  ngOnInit() {
    // const body = new HttpParams()
    //   .append('username', 'andrielson')
    //   .append('password', 'andrielson');
    // this.http
    //   .post('http://localhost:8080/login', body, {
    //     observe: 'response',
    //     responseType: 'arraybuffer',
    //   })
    //   .pipe(
    //     concatMap(({ headers }) => {
    //       console.log({ headers });
    //       const token = headers.get('X-Auth-Token')!;
    //       console.log({ token });
    //       return this.http.get<{ username: string }>(
    //         'http://localhost:8080/user',
    //         {
    //           headers: new HttpHeaders({ 'X-Auth-Token': token }),
    //         }
    //       );
    //     })
    //   )
    //   .subscribe((user) => console.log({ user }));
  }

  async login() {
    const withCredentials = true;
    const body = new HttpParams()
      .append('username', 'andrielson')
      .append('password', 'andrielson')
      .append('remember-me', true);
    const contentType = 'application/x-www-form-urlencoded';
    const request$ = this.http
      .head('http://localhost:8080/login', { withCredentials })
      .pipe(
        concatMap(() => {
          const { cookie } = document;
          console.log({ cookie });
          const csrf = cookie.split('=')[1];
          console.log({ csrf });
          const headers = new HttpHeaders()
            .append('Content-Type', contentType)
            .append('X-XSRF-TOKEN', csrf);
          return this.http.post<{ username: string }>(
            'http://localhost:8080/login',
            body,
            { headers, withCredentials }
          );
        }),
        concatMap(() =>
          this.http.get('http://localhost:8080/', {
            withCredentials,
            responseType: 'arraybuffer',
          })
        )
      );
    await firstValueFrom(request$);
  }
}
