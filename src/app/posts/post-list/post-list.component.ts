import { Component , Input, OnDestroy, OnInit } from "@angular/core";
import {MatExpansionModule} from '@angular/material/expansion'
import { CommonModule } from "@angular/common"; 
import { Post } from "../post.model"; 
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator'
import { routes } from "../../app.routes";
import { RouterLink, RouterModule } from "@angular/router";
import { AuthService } from "../../auth/auth.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrl:'./post-list.component.css',
    standalone: true,
    imports: [MatExpansionModule,CommonModule,MatButtonModule,RouterModule,MatProgressSpinnerModule,MatPaginatorModule],
})

export class PostListComponent implements OnInit , OnDestroy{
//    @Input()
    public posts:Post[]=[];
    private postsSub:Subscription ;
    isLoading = false
    totalPosts = 0;
    postsPerPage =2;
    currPage=1
    pageSizeOptions = [1,2,5,10];
    private authStatusSub:Subscription;
    userIsAutonticated = false;
    userId:string;

   constructor(public postsService:PostsService , private authService:AuthService ){
    this.initPosts()
   }

   ngOnInit(): void {;this.isLoading = true;this.initPosts();}

   ngOnDestroy(): void {this.postsSub.unsubscribe();this.authStatusSub.unsubscribe();}

   initPosts():void{
        this.postsService.getPosts(this.postsPerPage,this.currPage);
        this.postsSub =  this.postsService.getPostsUpdatedListener()
        .subscribe((postsData:{posts:Post[],postCount:number})=>{
            this.isLoading = false;
            this.posts = postsData.posts;
            this.totalPosts = postsData.postCount;
     }); 
        this.userIsAutonticated = this.authService.getIsAuth();
        this.userId = this.authService.getUserId();
        this.authStatusSub = this.authService.getAuthStatusListener()
        .subscribe(isAutonticated =>{
            this.userIsAutonticated = isAutonticated;
            this.userId = this.authService.getUserId();
        });
   }

   onDelete(postId:string){
        this.isLoading = true;
        this.postsService.deletePost(postId).subscribe(()=>{this.postsService.getPosts(this.postsPerPage,this.currPage);},()=>{this.isLoading=false});
   }

   onChangedPage(pageData:PageEvent){
    this.isLoading = true;
        this.currPage = pageData.pageIndex+1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage,this.currPage)
   }
}