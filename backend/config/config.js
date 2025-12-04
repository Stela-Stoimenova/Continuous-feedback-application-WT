require('dotenv').config();
module.exports = {
  development: {
    dialect: "sqlite",
    storage: "./database.sqlite", // this file will be created automatically
    logging: false
  },

  test: {
    dialect: "sqlite",
    storage: "./database.test.sqlite",
    logging: false
  },

  production: {
    dialect: "sqlite",
    storage: "./database.prod.sqlite",
    logging: false
  }
};

/*
module.exports={
    development:{
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
    },

    test:{
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false
    },

    production:{
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false
    }
};*/