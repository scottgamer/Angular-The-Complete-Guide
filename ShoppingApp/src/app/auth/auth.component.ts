import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService, AuthResponseData } from "./auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
  providers: [AuthService]
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const { email, password } = value;

    let authObservable: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signUp(email, password);
    }

    authObservable.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(["/recipes"]);
      },
      errorRes => {
        switch (errorRes.error.error.message) {
          case "EMAIL_EXISTS":
            this.error = "This email exists already";
            break;
          case "EMAIL_NOT_FOUND":
            this.error = "This email doesn't exist";
            break;
          case "INVALID_PASSWORD":
            this.error = "This password is not correct";
            break;
          default:
            this.error = "An unexpected error ocurred";
        }
        this.isLoading = false;
      }
    );

    form.reset();
  }
}
