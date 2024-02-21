import {HttpEventType, HttpInterceptorFn} from '@angular/common/http';
import {tap} from "rxjs";

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(
    tap((response) => {
      if (response && Object.keys(response).includes('type')){
        switch (response.type) {
          case HttpEventType.UploadProgress:
            const percentDone = response.total ? Math.round(100 * response.loaded / response.total) : 0;
            console.log("Uploaded => ",percentDone)
            break;
          case HttpEventType.Response:
            break;
          case HttpEventType.DownloadProgress:
            const percentDones = response.total ? Math.round(100 * response.loaded / response.total) : 0;
            console.log("DownloadProgress =>",percentDones)
            break
          case HttpEventType.Sent:
            break
        }
      }
    }),
  );
};
