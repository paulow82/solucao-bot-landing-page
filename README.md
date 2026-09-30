# Landing Page — Solução Bot

Landing page estática do Solução Bot, pronta para GitHub Pages ou qualquer hospedagem de arquivos HTML.

## Publicar no GitHub Pages

1. Crie um repositório novo no GitHub.
2. Envie todos os arquivos desta pasta para a raiz do repositório.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, selecione **GitHub Actions**.
5. O fluxo incluído em `.github/workflows/pages.yml` publicará o site automaticamente.

O endereço será exibido na página **Actions** e em **Settings → Pages** após a primeira publicação.

## Editar

- `index.html`: conteúdo e estrutura da página.
- `styles.css`: estilos gerais.
- `demo.css`: animações e apresentação da plataforma.
- `app.js`: interações da landing page.
- `demo.js`: troca automática entre as telas demonstrativas.
- `assets/`: imagens da plataforma com dados fictícios.

Não há etapa de compilação nem dependências. Para visualizar localmente, abra `index.html` no navegador.
