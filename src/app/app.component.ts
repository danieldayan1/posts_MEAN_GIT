// import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { HeaderComponent } from './header/header.component'
import { FormsModule , NgModel} from '@angular/forms';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostsService } from './posts/posts.service';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet , PostCreateComponent,HeaderComponent,FormsModule,PostListComponent,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[PostsService]
})
export class AppComponent {
  // storedPosts:Post[] =[];

  // onPostAdded(post:Post){
  //   this.storedPosts.push(post);
  // }
}
