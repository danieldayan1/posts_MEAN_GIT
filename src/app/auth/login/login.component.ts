import { Component } from "@angular/core";
import {MatCardModule} from '@angular/material/card' ;
import {MatInputModule } from '@angular/material/input';
import {MatFormFieldModule,MatFormField} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button' 
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'

import {FormsModule, NgForm} from '@angular/forms';
import { CommonModule } from "@angular/common";
import { AuthService } from "../auth.service";

@Component({
    templateUrl: './login.component.html',
    standalone: true,
    imports: [CommonModule,FormsModule,MatCardModule,MatInputModule,MatFormFieldModule,MatFormField,MatButtonModule,MatProgressSpinnerModule],
    styleUrl:'./login.component.css'
})

export class LoginComponent{
    isLoading=false;

    constructor(public authService:AuthService){}

    async onLogin(form:NgForm){
        if(form.invalid){return}
        this.isLoading = true;
        try{await this.authService.login(form.value.email,form.value.password);
        }catch(err){}
        this.isLoading = false;
    }
}