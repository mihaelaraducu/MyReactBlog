export interface User {
    id?: number;
    nume: string;
    prenume: string;
    email: string;
    parola?: string;
    confirm_password?: string;
    dataadaugare?: string;
  }