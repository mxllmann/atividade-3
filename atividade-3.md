# Atividade 3

Você deve criar um backend para smart lockers, que são armários para entrega de encomendas em condomínios, nos quais o entregador deposita a encomenda em um dos compartimentos do locker e o destinatário recebe uma notificação em um aplicativo informando que a encomenda foi entregue e está disponível para ser retirada.  

O backend será composto por cinco microservices, responsáveis pelas funcionalidades descritas a seguir:

- Cadastro de Lockers: mantém informações sobre todos os lockers instalados em condomínios e sua localização;
- Cadastro de Condôminos: registro com todas as pessoas que têm acesso a um determinado locker; 
- Controle de entregas: administra as entregas das encomendas que estão armazenadas nos lockers; 
- Serviço de logging: mantém um histórico de todas as entregas já realizadas;
- Controle de abertura: serviço executado em cada locker que permite controlar remotamente a abertura das suas portas.


Considere que o backend do sistema poderá ser acessado das seguintes maneiras:

- O entregador poderá usar a tela do locker para escolher o tamanho do compartimento (P, M, G ou XG) e armazenar uma encomenda para um condômino;
- O condômino poderá usar a tela ou o aplicativo móvel para verificar suas encomendas e abrir os compartimentos com suas encomendas;
- O administrador do sistema poderá usar a tela do locker ou o aplicativo para cadastrar lockers e condôminos e verificar os logs de entregas.

Nessa atividade não será necessário implementar o frontend e o sistema embarcado no locker; verificaremos o funcionamento do backend enviando requisições de teste aos serviços a partir de ferramentas como o Postman.

Os serviços de cadastro de lockers e de condôminos, o serviço de controle de entregas e o serviço de logging devem ser acessados por meio de um API gateway, que deve fornecer uma interface REST para acesso aos serviços. Sugere-se que as interações do gateway com os microservices também sejam feitas por meio de requisições REST. O uso de outras tecnologias que não foram abordadas nas aulas práticas da disciplina, como serviços de mensageria (RabbitMQ, ActiveMQ, ...), também é permitido, caso você já domine a tecnologia que deseja utilizar.

O API gateway e os microservices podem ser implementados utilizando o Node.js ou qualquer outra tecnologia que você conheça. Como servidor de banco de dados podem ser usados o SQLite (vide tutorial) ou qualquer outro banco de dados que você saiba utilizar. 

Cada serviço (exceto o controle de abertura) deve ter seu banco de dados, database ou collection própria, de modo que um microservice não deverá acessar os dados de outro. Sempre que for necessário ler ou alterar um dado de outro serviço, deve ser enviada uma requisição a ele (Dica: use o Axios para enviar uma requisição REST para outro microservice). 

O serviço de controle de abertura dos compartimentos do locker deve apenas receber requisições para abrir um compartimento e simular a sua abertura imprimindo uma mensagem na tela. 

