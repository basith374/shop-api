# Setting up the project

1. `npm install`
2. Create database
3. Create .env
```
DB_USER=root
DB_PASS=passwd
DB_DATB=shopdb
GOOGLE_CLIENT_ID=secret
JWT_SECRET=secret
```
4. `npx sequelize db:migrate`
5. `npx sequelize db:seed` (optional)
