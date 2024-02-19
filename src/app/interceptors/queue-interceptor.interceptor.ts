import {HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, catchError, tap, throwError} from "rxjs";

const pendingRequests: HttpRequest<any>[] = [];
let pendingRequestCount = 0;
const pendingRequestsQueue: { reqID: string, request: HttpRequest<any> }[] = [];
// private responseBehaviorSubject: BehaviorSubject<HttpEvent<any>> = new BehaviorSubject<any>(null);

let responseBehvaiorSubjectObject: any = {};

export const queueInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  // Check if there are 10 pending requests
  if (pendingRequestCount >= 10) {
    // Push the new request into the pending queue
    const reqID: string = "" + Math.floor(Math.random() * 10000) + 1;
    pendingRequestsQueue.push({
      reqID,
      request: req
    });

    console.log({
      reqID,
      request: req
    })
    responseBehvaiorSubjectObject[reqID] = new BehaviorSubject<any>(null);
    return responseBehvaiorSubjectObject[reqID].asObservable();
  } else
    responseBehvaiorSubjectObject = {};


  // console.log("PENDING REQUESTS", this.pendingRequests, this.pendingRequestsQueue)

  // Increment the pending request count
  pendingRequestCount++;
  // Push the request into the array of pending requests
  pendingRequests.push(req);

  return next(req).pipe(
    tap(
      (event: any) => {
        if (event instanceof HttpResponse)
          sendRequestFromQueue(next);
        return event;
      }
    ),
    catchError((err: any) => {
      sendRequestFromQueue(next);
      return throwError(() => new Error(err))
    })
  );
};

const processNextRequest = (request:HttpRequest<any>, next: HttpHandlerFn, reqID: string) => {
  next(request).pipe(
    tap(
      (event:any) => {
        if (event instanceof HttpResponse) {
          sendRequestFromQueue(next);
        }
        // console.log(reqID, event, this.pendingRequests);
        if (event) {
          responseBehvaiorSubjectObject[reqID].next(event);
        }
      }
    ),
    catchError((error:any)=>{
      responseBehvaiorSubjectObject[reqID].error({
        name: 'Guru',
        url: 'ERROR'
      });
      console.log("ERROR : ", error);
      return throwError(() => new Error(error))
    })
  );
}

// Function to Send Checks Queu and Send REQUEST FROM Queue
const sendRequestFromQueue = (next: HttpHandlerFn) => {
  // If request is successful, decrement the pending request count
  pendingRequestCount--;
  // Process the pending queue if there are any requests
  if (pendingRequestsQueue.length > 0) {
    const nextOne = pendingRequestsQueue.shift();
    const reqID: any = nextOne?.reqID;
    const nextRequest: any = nextOne?.request;
    processNextRequest(nextRequest, next, reqID);
  }
}


