import express from 'express';
import cors from 'cors';
import sql from './database.js';
import { CriarHash } from './util.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //middleware que serve para interpretar os dados vindos do corpo da requisição (body)
                                                 // em requisições do tipo POST, PUT, etc.
app.use(cors());

app.post('/usuario', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verifica se o e-mail já está cadastrado
    const verificacao = await sql`SELECT id FROM usuarios WHERE email = ${email}`;
    if (verificacao.length > 0) {
      return res.status(400).json('Email já cadastrado');
    }

    // Criptografa a senha
    const hash = await CriarHash(senha, 10);

    // Insere o novo usuário
    await sql`
      INSERT INTO usuarios (nome, email, senha, funcao)
      VALUES (${nome}, ${email}, ${hash}, 'aluno')
    `;

    return res.status(201).json('Cadastrado com sucesso!');
  } catch (error) 
  {
    console.error('Erro inesperado:', error);
    return res.status(500).json('Ocorreu um erro inesperado');
  }
});

app.get('/questoes', async (req, res) =>{
  try{
      const questao = await sql`SELECT * FROM questoes ORDER BY random() limit 40`
      return res.status(200).json(questao)
  }   
  catch(error){
      return res.status(500).json("Erro ao consultar questão")
  }
})

app.post('/questao/nova', async (req, res) => {
  try
  {
    const { enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta } = req.body;
    const insert = await sql `INSERT INTO questoes
    (enunciado, materia, dificuldade, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta)
    VALUES (${enunciado}, 'fracao', 'medio', ${alternativa_a}, ${alternativa_b}, ${alternativa_c}, ${alternativa_d}, ${resposta_correta})`;
    res.status(200).json('Questão criada com sucesso!');
  }

  catch(error){
    console.log(error)
    if(error.code == 23505){
      return res.status(409).json('Erro ao cadastrar')
    }
    return res.status(500).json('Erro ao cadastrar questão')
  }});

app.listen(3000, () => {
  console.log('API está no ar!');
});