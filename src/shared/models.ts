export interface Magazine {
  title: string;
  isbn: string;
  authors: Author[];
  publishedAt: Date;
}

export interface Book {
  title: string;
  isbn: string;
  authors: Author[];
  description: string;
}

export interface Author {
  email: string;
  firstName: string;
  lastName: string;
}

export type Literature = Book | Magazine;
