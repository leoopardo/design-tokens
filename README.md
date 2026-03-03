# design-tokens

Pacote de design tokens gerado a partir de `tokens.json`.

## Scripts

- `npm run normalize`: normaliza tokens para `tokens-normalized/`.
- `npm run build`: gera artefatos finais em `dist/`.

## Uso do pacote

```js
import tokens, { light, dark } from 'design-tokens';
```

Ou por tema:

```js
import light from 'design-tokens/light';
import dark from 'design-tokens/dark';
```

## Publicação no GitHub Packages

1. Use nome escopado no `package.json` (ex.: `@sua-org/design-tokens`).
2. Crie release publicada no GitHub ou execute manualmente o workflow `Publish Package`.
3. Instalação no consumidor:

```bash
npm config set @sua-org:registry https://npm.pkg.github.com
npm install @leoopardo/design-tokens
```

## Instalando o pacote no seu projeto

```bash
npm install @leoopardo/design-tokens
```

```bash
yarn add @leoopardo/design-tokens
```

## CI

- `Normalize Tokens` (`.github/workflows/normalize-main.yml`): roda em cada push na `main`, executa `npm run normalize` e faz commit automático se houver mudança.
- `Build Tokens` (`.github/workflows/build.yml`): roda em push na `main`, executa `npm run build`.
- `Publish Package` (`.github/workflows/publish.yml`): publica no GitHub Packages via release publicada ou disparo manual.
