import { Component, Injectable, NgModule } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient, HttpClientModule, HttpHandler } from "@angular/common/http";
import { Router } from "@angular/router";


@Injectable({providedIn: 'root'})
export class PostsService{
    private  posts: Post[]=[];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http:HttpClient , private router:Router){}

    getPosts(){
        this.http.get<{message:string,posts:any}>('http://localhost:3000/api/posts')
        .pipe(map((postData)=>{
            return postData.posts.map((post)=>{
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath
                }
            })
        }))
        .subscribe((transPostData)=>{
            this.posts = transPostData;
            this.postsUpdated.next([...this.posts]);
        });
    }

    getPostsUpdatedListener(){
        return this.postsUpdated.asObservable();
    }

    getPost(id:string){
        return this.http.get<{_id:string,title:string,content:string,imagePath:string}>('http://localhost:3000/api/posts/'+id)
    }

    addPost(title:string,content:string,image:File){
        // const post:Post = {id:null,title:title,content:content};
        const postData=new FormData();
        postData.append("title",title);
        postData.append("content",content);
        postData.append("image",image);
        this.http.post<{message:string,post:Post}>('http://localhost:3000/api/posts',postData)
            .subscribe((responseData)=>{
                const post:Post = {id:responseData.post.id, title:title, content:content, imagePath:responseData.post.imagePath}
                const postId = responseData.post.id
                post.id = postId;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            })
    }

    deletePost(postId:string){
        this.http.delete('http://localhost:3000/api/posts/'+postId)
        .subscribe(()=>{
            const updatedPosts = this.posts.filter(post=>post.id !== postId)
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts])
        })
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
             postData = {id:id , title:title , content:content, imagePath:image};
        }
        this.http.put('http://localhost:3000/api/posts/'+id,postData)
        .subscribe((response:Post)=>{
            const updatedPosts = {...this.posts};
            const oldPostIndex = updatedPosts.findIndex((p)=>{p.id===id});
            const post:Post = {id:id , title:title , content:content, imagePath:response.imagePath}
            updatedPosts[oldPostIndex] = post;
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        })
    }
}