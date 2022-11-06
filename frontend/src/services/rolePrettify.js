
export default function rolePrettify(role) {
    switch(role) {
        case "ROLE_ADMIN":
          return "Админ";
        case "ROLE_MODERATOR":
          return "Модератор";
        case "ROLE_USER":
          return "Пользователь";
      }
}