#Musical Thing

## Introduction

O Musical Thing é uma aplicação web voltada para streaming de musicas. Os dados das playlists, albuns, musicas, uruarios e artistas sao consultados atraves da [https://developer.spotify.com/](Web API | Spotify For Developers).


## Getting Started

Primeiro você precisa de um [https://developer.spotify.com/dashboard](Spotify Client ID).

```
Dashboard > "Nome da aplicacao" > SettingsBasic > Information
```

Você terá que definir um arquivo '.env' e definir as seguintes variáveis:

```
NEXT_PUBLIC_SPOTIFY_CLIENT_ID='YOUR_CLIENT_ID'
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI='http://localhost:3000/'
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



### References
[https://developer.spotify.com/documentation/web-api](Documentação Web API | Spotify For Developers)