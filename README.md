# Kanban
This is a kanban task management web app. It is possible to create boards, custom columns and tasks.

## General info
There is a live demo available [here](https://kanban-35a.pages.dev).

At the moment, I implemented basic features. Occasionally, I might hop on this project and add new stuff (e.g. shared boards, dark theme, subtasks).

## "nice to know" information
Don't use the online demo to store important information since a preconfigured service truncates all the tables every week.

The online demo uses only free-tier cloud services that have a maximum request limit per month. For this reason, if the online demo exceeds the free-tier request limit, it won't be available until the following month.

## Technologies
[![github-actions](https://img.shields.io/badge/github-actions-161b22?style=for-the-badge&logo=github&logoColor=white)](https://docs.github.com/en/actions) [![cloudflare-workers](https://img.shields.io/badge/workers-161b22?style=for-the-badge&logo=cloudflare&logoColor=f6821f)](https://workers.cloudflare.com) [![prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/) [![postgres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
)](https://www.postgresql.org/) [![trpc](https://img.shields.io/badge/trpc-222222?style=for-the-badge&logo=trpc&logoColor=3c8dc7)](https://trpc.io/) [![react](https://img.shields.io/badge/react-222222?style=for-the-badge&logo=react&logoColor=61dafb)](https://reactjs.org/) [![docker](https://img.shields.io/badge/docker-20232A?style=for-the-badge&logo=docker&logoColor=61DAFB)](https://www.docker.com/) 

- Github Action as CI/CD
- Cloudflare Workers for hosting backend services
- Prisma with postgres as database
- tRPC for typesafe APIs
- React for frontend
- Docker and other technologies for local development