![](../frontend/src/assets/logo.svg)

# Backend

O Backend consiste em uma API RESTful que implementa as necessidades da aplicação, tais como adição e visualização de pontos de coleta. Para seu desenvolvimento, foi utilizado Node.js e TypeScript.

## Execução

Para iniciar a API:

1. `npm install` - Instala as dependências do projeto
2. `npm run knex:migrate` - Usa o knex para criar os campos necessários da base de dados
3. `npm run knex:seed` - Faz as seeds no banco de dados para gerar os materiais de coleta (óleo de cozinha, lâmpadas...)
4. `npm run dev` - Inicializa a API

Nesse ponto a API já está pronta para ser usada.


## Implementações futuras

Há alguns pontos que ainda devem ser implementados na API futuramente:

- Rotas para edição e remoção de ponto apropriadas;
- Rota para solicitação de ponto sem restrições de região/tipo/... ;
- Outros...? Não consigo pensar em nada agora mas certamente há outros pontos para melhorar na API.