export interface Review {
    id: number;
    user_email: string;
    stars: number;
    comment: string;
    book_id: number;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    reviews: Review[];
}

export interface SpringError {
    violations: string[];
    detail: string;
}

export interface User {
    id: number;
    email: string;
    role: string;
}

export interface DecodedToken {
    exp: number;
    iat: number;
    role: string;
    sub: string;
}

export interface LoginRes {
    token: string;
    expires_in: number;
}

export interface RegisterRes {
    message: string;
    user: User;
}

export interface ReviewCreateReq {
    stars: number;
    comment: string;
    bookId: number;
}

export interface ReviewUpdateReq {
    stars: number;
    comment: string;
}

export interface BookCreateReq {
    title: string;
    author: string;
}

export interface BookUpdateReq {
    title: string;
    author: string;
}

export interface RegisterReq {
    email: string;
    password: string;
    confirm_password: string;
}

export interface LoginReq {
    email: string;
    password: string;
}
