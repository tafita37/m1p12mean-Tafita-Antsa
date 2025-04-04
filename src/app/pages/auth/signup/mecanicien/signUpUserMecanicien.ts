import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { LoginUserService } from '../../../../service/login/user/login-user.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-sign-up-user-mecanicien',
    standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        MessageModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule,
        DialogModule,
        ProgressSpinnerModule
        // AppFloatingConfigurator
    ],
    templateUrl: "./signUpUserMecanicien.html"
})
export class SignUpMecanicien {
    user = { nom: "RABERARISOA", prenom: "Hery", email: "hery.rabea@gmail.com", mdp: "0000" }
    errorMessage: string = '';
    sucessMessage: string = '';
    isLoading : boolean = false;

    constructor(private loginUserService: LoginUserService) { }

    signUpUser(): void {
        this.isLoading = true;
        this.errorMessage = "";
        this.sucessMessage = "";
        if (this.user.nom && this.user.prenom && this.user.email && this.user.mdp) {
            this.loginUserService.signUpUserMecanicien(this.user).subscribe(data => {
                this.sucessMessage = data.message;
                this.isLoading = false;
            }, error => {
                console.error('Erreur lors de la connexion:', error);
                this.errorMessage = error.error.message;
                this.isLoading = false;
            });
        } else {
            this.errorMessage = "Vous n'avez pas remplis certains champs";
            this.isLoading = false;
        }
        this.sucessMessage = "";
        this.user = { nom: "", prenom: "", email: "", mdp: "" };
    }

}
