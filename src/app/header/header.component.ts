import { Component, OnDestroy, OnInit } from "@angular/core";
import {MatToolbarModule} from '@angular/material/toolbar'
import { RouterModule } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { CommonModule } from '@angular/common';  


@Component({
    selector:'app-header',
    templateUrl:'./header.component.html',
    standalone:true,
    imports:[MatToolbarModule,RouterModule,CommonModule],
    styleUrl:'./header.component.css'
})
export class HeaderComponent implements OnInit,OnDestroy{
    public userIsAuthenticated = false;
    private authListenerSubs:Subscription;

    constructor(private authService:AuthService){}

    ngOnInit(): void {
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authListenerSubs = this.authService.getAuthStatusListener()
        .subscribe(isAutenticated =>{
            this.userIsAuthenticated = isAutenticated;
        })
    }

    onLogout(){this.authService.logout();}

    ngOnDestroy(): void {}
}