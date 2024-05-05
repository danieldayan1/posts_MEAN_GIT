import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    
    constructor(private AuthService:AuthService){}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken  = this.AuthService.getToken();
        const authrequest = req.clone({headers:req.headers.set('Authorization',"Bearer " + authToken)});
        return next.handle(authrequest);
    }
}