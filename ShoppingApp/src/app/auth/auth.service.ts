import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

const API_KEY = `AIzaSyAN-ZltPE4N3T40LqPTqacBmdE6lynS_B0`;

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      { email, password, returnSecureToken: true }
    );
  }
}
