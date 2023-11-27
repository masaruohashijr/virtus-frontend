import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { HOME } from 'src/app/common/route-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private _router: Router) {

  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.loginForm.disable();
    this.errorMessage = '';
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService.signIn({
      username: username,
      password: password,
      grant_type: 'password'
    }).subscribe((resp) => {
      this._router.navigateByUrl(HOME);
    }, () => {
      this.loginForm.enable();
      this.errorMessage = 'Usuário e/ou senha incorretos.'
    });

    if (username === 'seuUsuario' && password === 'suaSenha') {
      console.log('Login bem-sucedido!');
    } else {

    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

}
