import { Component, Injectable, NgModule } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient, HttpClientModule, HttpHandler } from "@angular/common/http";
import { Router } from "@angular/router";


const BACKEND_URL = 'http://localhost:3000/api/posts/';

@Injectable({providedIn: 'root'})
export class PostsService{
    private  posts: Post[]=[];
    private postsUpdated = new Subject<{posts:Post[],postCount:number}>();

    constructor(private http:HttpClient , private router:Router){}

    getPosts(postsPerPage:number,currPage:number){
        const queryParams = `?pagesize=${postsPerPage}&page=${currPage}`;
        this.http.get<{message:string,posts:any,maxPosts:number}>(BACKEND_URL + queryParams)
        .pipe(map((postData)=>{
            return {posts:postData.posts.map((post)=>{
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath,
                    creator: post.creator
                }
            }),maxPosts:postData.maxPosts}
        }))
        .subscribe((transPostData)=>{
            this.posts = transPostData.posts;
            this.postsUpdated.next({posts:[...this.posts],postCount:transPostData.maxPosts});
        });
    }

    getPostsUpdatedListener(){
        return this.postsUpdated.asObservable();
    }

    getPost(id:string){
        return this.http.get<{_id:string,title:string,content:string,imagePath:string,creator:string}>(BACKEND_URL+id)
    }

    addPost(title:string,content:string,image:File){
        const postData=new FormData();
        postData.append("title",title);
        postData.append("content",content);
        postData.append("image",image);
        this.http.post<{message:string,post:Post}>(BACKEND_URL,postData)
            .subscribe((responseData)=>{
                this.router.navigate(["/"]);
            })
    }

    deletePost(postId:string){
        return this.http.delete(BACKEND_URL+postId)
    }

    updatePost(id:string , title:string , content:string , image:File |  string){
        let postData: Post | FormData;
        if(typeof(image) === 'object'){
            postData = new FormData();
            postData.append("id",id);
            postData.append("title",title);
            postData.append("content",content);
            postData.append("image",image);
        }else{
             postData = {id:id , title:title , content:content, imagePath:image , creator:null};
        }
        this.http.put(BACKEND_URL+id,postData)
        .subscribe((response:Post)=>{
            this.router.navigate(["/"]);
        })
    }
}