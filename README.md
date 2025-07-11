# Otaku Stars Monorepo

Monorepo moderno utilizando Turborepo para gerenciar múltiplos apps e pacotes.

---

## Tecnologias

- **Next.js** (React) no frontend (`apps/web`)
- **Fastify** com TypeScript no backend (`apps/api`)
- **Tailwind CSS** + **ShadCN UI** no frontend
- **Prisma ORM** para acesso ao MySQL
- **MySQL** banco de dados local ou via Docker
- **ESLint** configurado para auto-fix ao salvar
- **pnpm** como gerenciador de pacotes e workspaces
- **Turborepo** para cache inteligente e execução em pipeline

---

## Estrutura do projeto

```
my-monorepo/
├── apps/
│   ├── web/         # Frontend Next.js
│   └── api/         # Backend Fastify + Prisma
├── packages/        # Bibliotecas e componentes compartilhados (opcional)
├── docker-compose.yml # Configuração do MySQL via Docker (uso futuro)
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
```

---

## Configuração do Banco de Dados

No arquivo `apps/api/.env` existem duas variáveis de conexão para o MySQL:

```env
DATABASE_URL_WINDOWS="mysql://root:@localhost:3306/otaku_stars"   # Banco local no Windows
DATABASE_URL_DOCKER="mysql://root:@localhost:3307/otaku_stars"    # Banco via Docker (porta 3307)
```

> Altere a variável usada no arquivo `prisma/schema.prisma` conforme o ambiente desejado.

---

## Rodando o projeto

### 1. Instalar dependências

Na raiz do monorepo:

```bash
pnpm install
```

### 2. Rodar o backend Fastify (API)

```bash
cd apps/api
pnpm dev
```

API rodando em: `http://localhost:3333`

---

### 3. Rodar o frontend Next.js

```bash
cd apps/web
pnpm dev
```

Frontend rodando em: `http://localhost:3000`

---

### 4. Rodar o MySQL via Docker (uso futuro)

Na raiz do monorepo:

```bash
docker-compose up -d
```

MySQL estará disponível na porta `3307`.

---

## Configuração ESLint + Auto-fix

- ESLint configurado para corrigir erros automaticamente ao salvar o código.
- Recomendado usar VS Code com as seguintes configurações:

```json
// .vscode/settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "eslint.validate": ["javascript", "typescript"],
  "editor.formatOnSave": true
}
```

---

## Prisma ORM

- O Prisma está configurado para gerenciar o banco MySQL.
- Use o Prisma CLI para gerar client e atualizar o banco:

```bash
npx prisma generate
npx prisma db push
```

---

## Scripts úteis

| Comando                      | Descrição                                  |
|-----------------------------|--------------------------------------------|
| `pnpm dev`                  | Roda todos apps em modo desenvolvimento    |
| `pnpm --filter web dev`     | Roda só o frontend Next.js                  |
| `pnpm --filter api dev`     | Roda só o backend Fastify                    |
| `pnpm lint`                 | Executa ESLint em todos os pacotes          |
| `docker-compose up -d`      | Sobe o container MySQL para uso futuro      |

---

## Próximos passos

- Criar models e seeds no Prisma
- Implementar rotas REST e autenticação no Fastify
- Desenvolver UI com ShadCN components
- Adicionar testes e pipeline CI/CD

---

## Contato

Qualquer dúvida ou sugestão, fique à vontade para abrir uma issue ou me chamar!

---

**Boas codificações! 🚀**
