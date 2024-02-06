import { HttpInterceptorFn } from '@angular/common/http';
import {catchError, throwError} from "rxjs";
import {MessageService} from "primeng/api";
import {inject} from "@angular/core";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error) => {
      if ([401, 403].includes(error.status)) {
        console.log('Unauthorized or forbidden')
      }

      const errorMessage = error.error.message || error.statusText;

      messageService.add({severity:'error', summary: 'Error', detail: errorMessage});

      return throwError(()=>error)
    })
  );
};
