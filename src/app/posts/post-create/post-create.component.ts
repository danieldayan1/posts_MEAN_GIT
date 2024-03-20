import { Component, EventEmitter , OnInit, Output } from "@angular/core";

import {ReactiveFormsModule ,FormsModule, NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import {MatInputModule } from '@angular/material/input';
import {MatFormFieldModule,MatFormField} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card' ;
import {MatButtonModule} from '@angular/material/button' 
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { Post } from '../post.model'; 
import { CommonModule } from "@angular/common";
import { PostsService } from "../posts.service";
import { Router, ActivatedRoute } from "@angular/router";
import { mimeType } from "./mime-type.validator";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css'],
    standalone: true,
    imports:[FormsModule,MatInputModule,MatFormFieldModule,MatFormField,MatCardModule,MatButtonModule,CommonModule,MatProgressSpinnerModule,ReactiveFormsModule]
})

export class PostCreateComponent implements OnInit{
    // postCreated = new EventEmitter<Post>();
    private mode = 'create';
    private postId:string;
    post:Post;
    isLoading = false;
    form:FormGroup;
    imagePreview:string;

    constructor(public postsService:PostsService , public route:ActivatedRoute , private router:Router){}

    ngOnInit(): void {
        this.form = new FormGroup({
            title: new FormControl(null,{validators:[Validators.required, Validators.minLength(3)]}),
            content: new FormControl(null,{validators:[Validators.required]}),
            image: new FormControl(null,{validators:[Validators.required],asyncValidators:[mimeType]})
        })
        this.route.paramMap.subscribe((paramMap)=>{
            if(paramMap.has('postId')){
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading =true
                this.postsService.getPost(this.postId).subscribe(postData=>{
                    this.isLoading = false;
                    this.post = {id: postData._id , title: postData.title , content: postData.content , imagePath:postData.imagePath};
                    this.form.setValue({title:this.post.title , content:this.post.content , image:this.post.imagePath});
                });
            }else{
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onSavePost(){
         if(this.form.invalid){return}
         this.isLoading =true;
         if(this.mode === 'create'){ 
          this.postsService.addPost(this.form.value.title,this.form.value.content,this.form.value.image)
         }else{
          this.postsService.updatePost(this.postId,this.form.value.title,this.form.value.content,this.form.value.image)
         }
         this.isLoading =false;
         this.form.reset();
         this.router.navigate(["/"]);
     }

    // onSavePost1(form:NgForm){
    //    if(form.invalid){return}
    //    this.isLoading =true;
    //    if(this.mode === 'create'){ 
    //     this.postsService.addPost(form.value.title,form.value.content)
    //    }else{
    //     this.postsService.updatePost(this.postId,form.value.title,form.value.content)
    //    }
    //    this.isLoading =false;
    //    form.resetForm();
    //    this.router.navigate(["/"]);
    //    //this.postCreated.emit(post);
    // }

    onImagePicked(event:Event){
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image:file});
        this.form.get("image").updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = ()=>{
            this.imagePreview = reader.result as string
        }
        reader.readAsDataURL(file)
    }
}