export class LoginRequestDto {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }

  toJSON() {
    return {
      email: this.email,
      password: this.password,
    };
  }
}