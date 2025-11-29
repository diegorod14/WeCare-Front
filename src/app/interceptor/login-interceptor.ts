import {HttpInterceptorFn, HttpStatusCode} from '@angular/common/http';
import {catchError, EMPTY, throwError} from 'rxjs';

export const loginInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  let authReq = req;
  if (token) {
    authReq = req.clone({
      withCredentials : true,
      headers: req.headers.set('Authorization', 'Bearer ' +
        localStorage.getItem('token')?.toString())
    });
  }
  return next(authReq).pipe(
    catchError(error => {
      if (error.status === HttpStatusCode.Forbidden) {
        alert("NO TIENES PERMISOS!");
        return EMPTY;
      } else {
        return throwError(() => error);
      }
    })
  );
};
