import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";

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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const { email, password } = value;

    this.isLoading = true;
    if (this.isLoginMode) {
      ///
    } else {
      this.authService.signUp(email, password).subscribe(
        resData => {
          console.log(resData);
          this.isLoading = false;
        },
        errorRes => {
          switch (errorRes.error.error.message) {
            case "EMAIL_EXISTS":
              this.error = "This email exists already";
              break;
            default:
              this.error = "An unexpected error ocurred";
          }
          this.isLoading = false;
        }
      );
    }

    form.reset();
  }
}
