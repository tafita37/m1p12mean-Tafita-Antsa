import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
// import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { LoginUserService } from '../../../service/login/user/login-user.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-login-user-client',
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
    ],
    templateUrl : "./loginUserClient.html"
})
export class LoginClient {
    user = { email: "herilala.rakoto@gmail.com", mdp : "0000"}
    errorMessage: string = '';
    sucessMessage: string = '';
    isLoading: boolean = false;

    constructor(private loginUserService: LoginUserService, private router : Router) { }

    loginUser(): void {
        this.isLoading = true;
        this.errorMessage = "";
        if (this.user.email && this.user.mdp) {
            this.loginUserService.loginUserClient(this.user).subscribe(data => {
                localStorage.setItem(environment.tokenClientStorage, data.token);
                this.sucessMessage = "Connecté";
                this.router.navigate(['/client/voiture/crud']);
                this.isLoading = false;
            }, error => {
                console.error('Erreur lors de la connexion:', error);
                this.errorMessage = error.error.message;
                this.isLoading = false;
            });
        } else {
            this.errorMessage = "Email ou mot de passe manquant";
            this.isLoading = false;
        }
    }

}
