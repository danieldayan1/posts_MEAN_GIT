import { Component, EventEmitter , Output } from "@angular/core";

import { FormsModule, NgForm } from '@angular/forms';
import {MatInputModule } from '@angular/material/input';
import {MatFormFieldModule,MatFormField} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card' ;
import {MatButtonModule} from '@angular/material/button' 
import { Post } from '../post.model'; 
import { CommonModule } from "@angular/common";
import { PostsService } from "../posts.service";


@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css'],
    standalone: true,
    imports:[FormsModule,MatInputModule,MatFormFieldModule,MatFormField,MatCardModule,MatButtonModule,CommonModule]
})

export class PostCreateComponent{
    // postCreated = new EventEmitter<Post>();

    constructor(public postsService:PostsService){}

    onAddPost(form:NgForm){
        if(form.invalid){
            return
        }
       this.postsService.addPost(form.value.title,form.value.content)
       form.resetForm();
    //    this.postCreated.emit(post);
    }
}