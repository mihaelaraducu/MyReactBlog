export interface Post {
    id?: number;
    titlu: string;
    continut: string;
    categorie_id?: number;
    categorie_nume?: string;
    user_id?: number;
    poza?: string;
    dataadaugare?: string;
  }