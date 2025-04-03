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

@Component({
    selector: 'app-login-user-mecanicien',
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
        // AppFloatingConfigurator
    ],
    templateUrl : "./loginUserMecanicien.html"
})
export class LoginMecanicien {
    user = { email: "toavina.randrianarisoa@gmail.com", mdp : "0000"}
    errorMessage: string = '';
    sucessMessage: string = '';

    constructor(private loginUserService: LoginUserService, private router : Router) { }

    loginUser(): void {
        this.errorMessage = "";
        if (this.user.email && this.user.mdp) {
            this.loginUserService.loginUserMecanicien(this.user).subscribe(data => {
                localStorage.setItem(environment.tokenMecanicienStorage, data.token);
                this.sucessMessage = "Connecté";
                this.router.navigate(['/mecanicien/rdv/listeTache']);
            }, error => {
                console.error('Erreur lors de la connexion:', error);
                this.errorMessage = error.error.message;
            });
        } else {
            this.errorMessage = "Email ou mot de passe manquant";
        }
    }

}
