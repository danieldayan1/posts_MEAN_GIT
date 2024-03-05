import { Component, EventEmitter , OnInit, Output } from "@angular/core";

import { FormsModule, NgForm } from '@angular/forms';
import {MatInputModule } from '@angular/material/input';
import {MatFormFieldModule,MatFormField} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card' ;
import {MatButtonModule} from '@angular/material/button' 
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { Post } from '../post.model'; 
import { CommonModule } from "@angular/common";
import { PostsService } from "../posts.service";
import { Router, ActivatedRoute } from "@angular/router";


@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css'],
    standalone: true,
    imports:[FormsModule,MatInputModule,MatFormFieldModule,MatFormField,MatCardModule,MatButtonModule,CommonModule,MatProgressSpinnerModule]
})

export class PostCreateComponent implements OnInit{
    // postCreated = new EventEmitter<Post>();
    private mode = 'create';
    private postId:string;
    post:Post;
    isLoading = false;

    constructor(public postsService:PostsService , public route:ActivatedRoute , private router:Router){}

    ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap)=>{
            if(paramMap.has('postId')){
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading =true
                this.postsService.getPost(this.postId).subscribe(postData=>{
                    this.isLoading = false;
                    this.post = {id: postData._id , title: postData.title , content: postData.content}
                });
            }else{
                this.mode = 'create';
                this.postId = null;
            }
        });}

    onSavePost(form:NgForm){
       if(form.invalid){return}
       this.isLoading =true;
       if(this.mode === 'create'){ 
        this.postsService.addPost(form.value.title,form.value.content)
       }else{
        this.postsService.updatePost(this.postId,form.value.title,form.value.content)
       }
       this.isLoading =false;
       form.resetForm();
       this.router.navigate(["/"]);
       //this.postCreated.emit(post);
    }

}