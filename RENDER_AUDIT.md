# Auditoria de compatibilidade com Render

## Estado encontrado

- Repositório: `ianmartins-iftm/smartcart-MVP`.
- Branch auditada: `main`.
- Commit mais recente: `9a9d92d teste replit deploy`.
- O commit do Replit alterou apenas `.replit`, uma regra visual e seis linhas da configuração do Vite; não criou configuração para Render.
- `pnpm install --frozen-lockfile`, `pnpm run check` e `pnpm run build` passam localmente.

## Incompatibilidades e riscos

1. O servidor usa `PORT`, mas não informa explicitamente o host `0.0.0.0`; o Render exige bind público nesse host.
2. Não existe endpoint de health check declarado para o Render.
3. Não existe `render.yaml` com comandos reprodutíveis de build/start e `NODE_ENV=production`.
4. `client/index.html` sempre injeta o script de analytics com placeholders `%VITE_ANALYTICS_ENDPOINT%` e `%VITE_ANALYTICS_WEBSITE_ID%`; sem essas variáveis, o build gera avisos e o HTML produzido fica com placeholders inválidos.
5. A integração de mapas é opcional visualmente, mas assume `window.google` após falha de carregamento do script e pode gerar erro em produção quando as variáveis da Forge não estiverem configuradas.
6. O projeto contém `.replit`, mas esse arquivo não configura o Render e deve permanecer apenas como configuração específica do Replit.
7. O `package.json` declarava overrides e um patch de instrumentação em um campo `pnpm` que o pnpm 10 não lê; isso gerava avisos e não era usado pelo aplicativo em produção.

## Requisitos confirmados na documentação do Render

- Web Services devem escutar em `0.0.0.0`.
- O serviço deve preferir `process.env.PORT`; o valor padrão documentado do Render é `10000`.
- O Render aceita `healthCheckPath` em um Blueprint `render.yaml`.

## Plano de correção

- Adicionar `render.yaml` com runtime Node, comandos `pnpm install --frozen-lockfile && pnpm run build` e `pnpm start`, `NODE_ENV=production` e health check.
- Ajustar o servidor para `0.0.0.0` e criar `/health`.
- Tornar o script de analytics condicional às variáveis Vite.
- Tornar a inicialização do mapa resiliente quando a integração não estiver configurada ou falhar.
- Remover a configuração e o patch legados do pnpm, atualizar o lockfile e exigir Node 22.12 ou superior, compatível com o Vite 7.
- Adicionar validação local do build e do servidor de produção.
