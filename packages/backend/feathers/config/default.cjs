// const { feathersConfig, upstreetConfig } = require('@webaverse-studios/config')


// const { port, url } = feathersConfig


module.exports = {
  host: "localhost",
  port: 3402,
  public: "./public/",
  origins: [
    "http://localhost:3402",
    // url,
    // upstreetConfig.url,
  ],
  paginate: {
    default: 10,
    max: 50
  },
  sqlite: {
    client: "sqlite3",
    connection: "feathers.sqlite",
    useNullAsDefault: true
  },
  authentication: {
    entity: "user",
    service: "users",
    secret: process.env.FEATHERS_SECRET,
    authStrategies: [
      "jwt",
      "local",
      "gun",
      "test"
    ],
    jwtOptions: {
      header: {
        typ: "access"
      },
      audience: "https://yourdomain.com",
      algorithm: "HS256",
      expiresIn: "1d"
    },
    local: {
      usernameField: "email",
      passwordField: "password"
    }
  }
}
