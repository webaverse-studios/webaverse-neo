module.exports = {
  "host": "localhost",
  "port": 3030,
  "public": "./public/",
  "origins": [
    "http://localhost:3030",
    "http://localhost:3400",
  ],
  "paginate": {
    "default": 10,
    "max": 50
  },
  "sqlite": {
    "client": "sqlite3",
    "connection": "feathers.sqlite",
    "useNullAsDefault": true
  },
  "authentication": {
    "entity": "user",
    "service": "users",
    "secret": process.env.FEATHERS_SECRET,
    "authStrategies": [
      "jwt",
      "local"
    ],
    "jwtOptions": {
      "header": {
        "typ": "access"
      },
      "audience": "https://yourdomain.com",
      "algorithm": "HS256",
      "expiresIn": "1d"
    },
    "local": {
      "usernameField": "email",
      "passwordField": "password"
    }
  }
}
