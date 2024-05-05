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
    templateUrl: './signup.component.html',
    standalone: true,
    imports: [CommonModule,FormsModule,MatCardModule,MatInputModule,MatFormFieldModule,MatFormField,MatButtonModule,MatProgressSpinnerModule],
    styleUrl:'./signup.component.css'
})

export class SignupComponent{
    isLoading=false;
    message = ''

    constructor(public authService:AuthService){}

    async onSignup(form:NgForm){
        if(form.invalid){return;}
        this.isLoading = true;
        try{await this.authService.createuser(form.value.email,form.value.password);this.message = "User added sucessfuly !"
        }catch(err){
            this.message = "User not created . Try again !"
        }
        this.isLoading = false;
    }
}