# Deploy do SmartCart no Render

O repositório já contém um Blueprint em `render.yaml`. No painel do Render, crie um novo Web Service a partir de `ianmartins-iftm/smartcart-MVP`, selecione a branch `main` e use o Blueprint para aplicar a configuração. O serviço usa o plano gratuito, executa `pnpm install --frozen-lockfile && pnpm run build`, inicia com `pnpm start` e verifica a disponibilidade em `/health`.

O aplicativo escuta em `0.0.0.0` e usa a porta fornecida pelo Render em `PORT`. Não é necessário cadastrar `PORT` manualmente. `NODE_ENV=production` já está definido no Blueprint.

| Variável | Obrigatória | Finalidade |
| --- | --- | --- |
| `VITE_FRONTEND_FORGE_API_KEY` | Não | Habilita o carregamento do mapa Google Maps via proxy Forge. |
| `VITE_FRONTEND_FORGE_API_URL` | Não | Permite substituir a URL padrão do proxy Forge. |
| `VITE_ANALYTICS_ENDPOINT` | Não | Endpoint do analytics opcional. Deve ser usado junto com `VITE_ANALYTICS_WEBSITE_ID`. |
| `VITE_ANALYTICS_WEBSITE_ID` | Não | Identificador do site no analytics opcional. |

Sem as variáveis opcionais, o SmartCart continua funcionando como lista e otimizador de compras; o mapa e o analytics são simplesmente desativados. Como as variáveis `VITE_*` são incorporadas durante o build, cadastre-as no Render antes de iniciar um novo deploy quando esses recursos forem necessários.
