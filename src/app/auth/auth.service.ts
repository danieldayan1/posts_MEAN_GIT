import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthService{
    private isAutenticated= false;
    private token:string;
    private tokenTimer:any;
    private authStatusListener = new Subject<boolean>();

    constructor(private http:HttpClient, private router:Router){}

    getToken(){return this.token;}

    getIsAuth(){ return this.isAutenticated;}

    async createuser(email:String,password:String){
        const authData:AuthData =  {email:email,password:password}
        const response = await this.http.post('http://localhost:3000/api/user/signup',authData).toPromise()
        console.log(response)
    }

    async login(email:string,password:string){
        const authData:AuthData =  {email:email,password:password}
        await this.http.post<{token:string,expiresIn:number}>('http://localhost:3000/api/user/login',authData)
            .subscribe(response=>{
                this.token = response.token;
                if(this.token){
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration)
                    this.isAutenticated = true;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration*1000); 
                    this.saveAuthData(this.token,expirationDate)
                    this.router.navigate(['/']);
                }
            });
    }

    autoAuthUser(){
        const authInfo = this.getAuthData();
        if(!authInfo){return;}
        const now = new Date();
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
        if(expiresIn>0){
            this.token = authInfo.token;
            this.isAutenticated = true;
            this.setAuthTimer(expiresIn/1000)
            this.authStatusListener.next(true);
        }
    }

    logout(){
        this.token = null;
        this.isAutenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private saveAuthData(token:string,expirationDate:Date){
        if (typeof localStorage == 'undefined') {return}
        localStorage.setItem("token",token);
        localStorage.setItem("expiration",expirationDate.toISOString());

    }

    private clearAuthData(){
        if (typeof localStorage == 'undefined') {return}
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
    }

    private getAuthData(){
        if (typeof localStorage == 'undefined') {return}
        const token = localStorage.getItem("token") ;
        const expDate = localStorage.getItem("expirationDate") ;
        if(!token || !expDate){
            return;
        }
        return {token:token,expirationDate:new Date(expDate)};
    }

    private setAuthTimer(expiresInDuration:number){
        this.tokenTimer = setTimeout(()=>{
            this.logout()
        },expiresInDuration*1000)
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }
}