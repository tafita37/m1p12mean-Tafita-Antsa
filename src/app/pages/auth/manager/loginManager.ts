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
    selector: 'app-login-manager',
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
    templateUrl: "./loginManager.html"
})
export class LoginManager {
    manager = { email: "admin@gmail.com", mdp : "0000"}
    errorMessage: string = '';
    sucessMessage: string = '';

    constructor(private router: Router, private loginUserService: LoginUserService) { }

    loginManager(): void {
        this.errorMessage = "";
        if (this.manager.email && this.manager.mdp) {
            this.loginUserService.loginManager(this.manager).subscribe(data => {
                localStorage.setItem(environment.tokenManagerStorage, data.token);
                this.sucessMessage = "Connecté";
                this.router.navigate(['/manager/user/crud']);
            }, error => {
                console.error('Erreur lors de la connexion:', error);
                this.errorMessage = error.error.message;
            });
        } else {
            this.errorMessage = "Email ou mot de passe manquant";
        }
    }

}
