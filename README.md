# AppNest Backend

Backend app of AppNest software, built with Express.js

---

## How to start?

### Prerequisites

Make sure you have the following installed on your local machine:

- [Nodejs](https://nodejs.org/) (v14.x or later)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

**1. Clone the repo**

- `git clone -b dev https://github.com/appnest-dev/AppNest-BE.git`
- `cd AppNest-BE`

**2. Install the dependencies**

- `npm install`

**3. Make your Postgres database**

**4. Set up environment variables**

- `cp .env.example .env`
  **Set it with the right values**

**5. Set up config.json file (like .env file)**

- `cp config/config.example.json config/config.json`
  **Set it with the right values**

**6. seed initial data**

- `npx sequelize-cli db:seed:all`

**7. Start the server**

- `npm run dev`

---

### Release instructions

1. `git add [file]`

2. `npm run commit` (see [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) documentation)

#### The commit format

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

3. `npm run release:[patch | minor | major]`

![difference between major, minor and patch](https://res.cloudinary.com/practicaldev/image/fetch/s--l3wtOBiF--/c_limit,f_auto,fl_progressive,q_auto,w_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wjlxt40w9kzayorc9msn.png)

4. `git push --follow-tags origin dev`
