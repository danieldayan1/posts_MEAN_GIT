// import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { HeaderComponent } from './header/header.component'
import { FormsModule , NgModel} from '@angular/forms';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostsService } from './posts/posts.service';
import { AuthService } from './auth/auth.service';
import { HttpClient, HttpClientModule, HttpHandler, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthGuard } from './auth/auth.guard';
import { ErrorInterceptor } from './error-interceptor';
import {MatDialogModule,MatDialog} from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet , PostCreateComponent,HeaderComponent,FormsModule,
    PostListComponent,HttpClientModule,LoginComponent,SignupComponent,MatDialogModule,ErrorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[PostsService,AuthService,AuthGuard,
    {provide:HTTP_INTERCEPTORS,useClass: AuthInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS,useClass: ErrorInterceptor,multi:true}
  ]
  
})
export class AppComponent implements OnInit{
constructor(private authService:AuthService){}

  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
}
