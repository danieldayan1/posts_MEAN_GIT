import { Component , Input, OnDestroy, OnInit } from "@angular/core";
import {MatExpansionModule} from '@angular/material/expansion'
import { CommonModule } from "@angular/common"; 
import { Post } from "../post.model"; 
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { routes } from "../../app.routes";
import { RouterLink, RouterModule } from "@angular/router";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrl:'./post-list.component.css',
    standalone: true,
    imports: [MatExpansionModule,CommonModule,MatButtonModule,RouterModule,MatProgressSpinnerModule],
})

export class PostListComponent implements OnInit , OnDestroy{
//    @Input()
    public posts:Post[]=[];
    private postsSub:Subscription ;
    isLoading = false

   constructor(public postsService:PostsService){
    this.initPosts()
   }

   ngOnInit(): void {;this.isLoading = true;this.initPosts();}

   ngOnDestroy(): void {this.postsSub.unsubscribe();}

   initPosts():void{
        this.postsService.getPosts();
        this.postsSub =  this.postsService.getPostsUpdatedListener()
        .subscribe((posts:Post[])=>{
            this.isLoading = false;
            this.posts = posts;
     }); 
   }

   onDelete(postId:string){
        this.postsService.deletePost(postId);
   }
}