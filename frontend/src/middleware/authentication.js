import TokenService from "../services/token.service";

export default function ifAuthenticated(to, from, next) {
    const user = TokenService.getUser();

    if (user){
        next();
    } else {
        next({ name: 'login', query: { redirect_to: to.fullPath } })
    }
}