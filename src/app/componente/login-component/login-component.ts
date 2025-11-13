import {Component, inject} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {RequestDto} from '../../model/request-dto';
import {ResponseDto} from '../../model/response-dto';
import {Router} from '@angular/router';
import {LoginService} from '../../services/login-service';

@Component({
  selector: 'app-login-component',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  router: Router = inject(Router);
  loginForm: FormGroup;
  fb = inject(FormBuilder);
  loginService: LoginService = inject(LoginService);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  ngOnInit() {
    if(localStorage.getItem('token')!=null){
      localStorage.clear();//borra todos los items
      console.log("Token y items eliminados");
    }
    this.loadForm()
  }

  loadForm(): void {
    console.log("Form");
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const requestDto: RequestDto = new RequestDto()
      requestDto.username = this.loginForm.value.username;
      requestDto.password = this.loginForm.value.password;
      let responseDTO: ResponseDto = new ResponseDto();
      this.loginService.login(requestDto).subscribe({
        next: (data: ResponseDto): void => {
          console.log("Login response ROLs:", data.roles);
          console.log("Login response ROL:", data.roles[0]);
          localStorage.setItem('rol', data.roles[0]);
        },
        error: (error: any) => {
          console.error(error);
          this.router.navigate(['/login']);
        }
      })
      alert("Login ok!")
      this.router.navigate(['/home'])
    } else {
      alert("Formulario no valido!")
      console.log("Formulario no valido");
    }
  }
}
