import axios from "axios";
import type { Livro, LivroPayload } from "../types/livro";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export class LivrosService {
    static getLivros() {
        return axios.get<Livro[]>(`${BASE_URL}/livros`);
    }

    static getLivro(id: number) {
        return axios.get<Livro>(`${BASE_URL}/livros/${id}`);
    }

    static createLivro(body: LivroPayload) {
        return axios.post<Livro>(`${BASE_URL}/livros`, body);
    }

    static updateLivro(id: number, body: LivroPayload) {
        return axios.put<Livro>(`${BASE_URL}/livros/${id}`, body);
    }

    static deleteLivro(id: number) {
        return axios.delete<{ mensagem: string }>(`${BASE_URL}/livros/${id}`);
    }
}