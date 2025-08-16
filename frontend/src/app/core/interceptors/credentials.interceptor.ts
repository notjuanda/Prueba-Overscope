import { HttpRequest, HttpHandlerFn } from '@angular/common/http';

export function credentialsInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    let modifiedRequest = request;

    if (!(request.body instanceof FormData)) {
        modifiedRequest = request.clone({
        setHeaders: {
            'Content-Type': 'application/json'
        }
        });
    }

    const requestWithCredentials = modifiedRequest.clone({
        withCredentials: true
    });

    return next(requestWithCredentials);
}
