# Plano de Testes de Usabilidade — Portal de Extensão UNICAP

Plano prático para validar os fluxos principais com pessoas reais, conforme a
Sprint 6 do `SPRINT_PLAN.md`. Objetivo: encontrar atritos reais e priorizar
ajustes com base em evidência, não em achismo.

## 1. Escopo e público

**Fluxos cobertos:** acesso por perfil, vitrine pública, submissão de projeto,
acompanhamento (frequência/homologação), painel gestor.

**Perfis recrutados (5–8 participantes):**

| Persona | Qtd | Perfil no sistema |
|---|---|---|
| Docente que já submeteu projeto | 2–3 | gestor |
| Docente pela primeira vez | 2 | gestor |
| Estudante buscando oportunidade | 2–3 | estudante |
| Servidor gestor/comitê | 1 | gestor |

Critério de inclusão: nunca ter usado este protótipo. Sessões de 30–40 min,
remotas ou presenciais, com consentimento para anotações.

## 2. Roteiro de tarefas

Cada tarefa é lida sem revelar o caminho. Registrar tempo, erros e hesitações.

| # | Tarefa | Fluxo testado | Sucesso esperado |
|---|---|---|---|
| T1 | "Você é docente e quer ver os projetos do seu centro. Entre e encontre." | Acesso + painel | Login e leitura dos KPIs sem ajuda |
| T2 | "Encontre uma ação de extensão na área de saúde com vagas abertas." | Vitrine | Uso de busca e/ou filtro até o card |
| T3 | "Abra os detalhes e volte sem perder o filtro que você aplicou." | Vitrine + modal | Modal fecha (X, backdrop ou Esc) e listagem mantém filtro |
| T4 | "Submeta uma nova proposta: preencha o essencial e envie." | Submissão | Passa pelas 6 etapas; usa o rascunho se interrompida |
| T5 | *(interromper no meio)* "Feche e volte amanhã — o que você faria?" | Rascunho | Reconhece que pode continuar de onde parou |
| T6 | "Um bolsista registrou 35h neste mês. Homologue a folha." | Acompanhamento | Percebe o bloqueio do teto e entende a mensagem |
| T7 | "Identifique o que está pendente antes da reunião do comitê." | Painel gestor | Usa KPIs e/ou cartão de ações pendentes |
| T8 | "Descubra quando vence a entrega de relatórios parciais." | Prazos | Lê o calendário e interpreta urgência/vencido |

## 3. O que observar

- **Clareza:** a tela inicial de cada módulo explica sozinha o que fazer?
- **Descoberta:** filtros e busca são encontrados sem treinamento?
- **Confiança:** o usuário confia ao "Enviar" e ao "Homologar"? Lê o resumo antes?
- **Erros:** mensagens de validação são compreendidas e recuperáveis?
- **Formulário longo (T4/T5):** onde o usuário hesita ou tem medo de perder dados?
- **Tabelas (T6/T7):** legibilidade de status, badges e contadores.

## 4. Métricas por tarefa

| Métrica | Como coletar | Alarme |
|---|---|---|
| Taxa de sucesso | tarefa concluída sem ajuda | < 80% no agregado |
| Tempo até completar | cronômetro por tarefa | > 2× estimativa interna |
| Erros recuperáveis | contagem de tentativas erradas | ≥ 2 por usuário na mesma tarefa |
| Erros fatais | desistência da tarefa | qualquer ocorrência |
| Sacabilidade (1–5) | pergunta final por tarefa | média < 4 |
| Perguntas de ajuda | "o que é isso?" espontâneas | ≥ 1 por tarefa crítica |

## 5. Após as sessões

1. Consolide achados em uma tabela: *observação → severidade (0–3) → tarefa*.
2. Severidade 2+ entram como itens priorizados no backlog (registrar no
   `PROJECT_BRAIN.md` → Decisões do Projeto).
3. Ajustes de copy (textos de erro/rótulos) podem ser aplicados direto;
   mudanças de fluxo seguem o rito de sprint.
4. Re-teste só as tarefas afetadas na próxima rodada.

## 6. Checklist do moderador

- [ ] Roteiro impresso / cronômetro à mão
- [ ] Ambiente de teste com dados mock carregados
- [ ] Consentimento para anotações obtido
- [ ] Evitar explicar a interface — só repetir a tarefa
- [ ] Anotar citações literais dos participantes (insumo mais valioso)
