# Guia de Criação de Releases

Este documento descreve o passo a passo para criar e publicar uma nova release do projeto, garantindo consistência e seguindo as boas práticas de versionamento.

## Por que Criar uma Release?

Uma release marca um ponto estável e significativo na história do projeto. Ela agrupa um conjunto de novas funcionalidades, correções de bugs e melhorias, tornando mais fácil para os usuários e outros desenvolvedores entenderem o que mudou entre as versões.

Utilizamos o [Versionamento Semântico](https://semver.org/lang/pt-BR/) (`MAJOR.MINOR.PATCH`).

- **MAJOR**: para mudanças incompatíveis na API.
- **MINOR**: para adicionar funcionalidades de forma retrocompatível.
- **PATCH**: para correções de bugs retrocompatíveis.

## Passo a Passo para Criar uma Release

Siga estes passos cuidadosamente para garantir que a release seja publicada corretamente.

### Passo 1: Preparar a Branch `main`

Antes de tudo, certifique-se de que a branch `main` está estável e contém todas as alterações que devem fazer parte da nova release.

1. Faça um `pull` da `main` para garantir que você tem a versão mais recente:

```bash
git checkout main
git pull origin main
```

2. Verifique se todos os **Pull Requests** necessários foram mesclados.

### Passo 2: Atualizar a Documentação

A documentação deve refletir o estado da nova versão.

1. **Atualize o `CHANGELOG.md`**:
    - Vá para o arquivo `CHANGELOG.md`.
    - Altere a seção `[Unreleased]` para a nova versão (ex: `[1.0.0]`).
    - Adicione a data da release no formato `AAAA-MM-DD`.
    - Adicione uma nova seção `[Unreleased]` vazia no topo do arquivo para futuras alterações.

    **Exemplo:**

    ```diff
    --- a/CHANGELOG.md
    +++ b/CHANGELOG.md
    @@ -7,6 +7,10 @@
        
        ## [Unreleased]
        
    +### Added
    + - ...
    +
        ## [1.0.0] - 2024-05-21
        
        ### Added
        - ...
    ```

2. **Atualize o `README.md` (se necessário)**:
    - Verifique se o status dos projetos ou outras informações no `README.md` principal precisam ser atualizados para refletir a conclusão de uma etapa.

### Passo 3: Commitar as Alterações da Documentação

Crie um commit específico para a preparação da release.

```bash
git add README.md CHANGELOG.md
git commit -m "docs: Prepara para a release v1.0.0"
```

*Substitua `v1.0.0` pela versão correta.*

### Passo 4: Criar a Tag da Versão

Vamos criar uma "tag" anotada no Git. Tags anotadas são preferíveis porque armazenam metadados extras, como autor, data e uma mensagem.

```bash
git tag -a v1.0.0 -m "Release v1.0.0: Lançamento inicial do sistema de estacionamento"
```

*Novamente, substitua `v1.0.0` e a mensagem conforme a necessidade.*

### Passo 5: Publicar as Alterações

Agora, envie o commit e a nova tag para o repositório remoto no GitHub.

1. Envie o commit:

    ```bash
    git push origin main
    ```

2. Envie a tag:

    ```bash
    git push origin v1.0.0
    ```

### Passo 6: Criar a Release no GitHub

A tag está no repositório, mas a "Release" precisa ser criada na interface do GitHub para que fique visível e bem formatada.

1. Vá para a página principal do repositório no GitHub.
2. Clique em **"Releases"** na barra lateral direita.
3. Clique em **"Draft a new release"**.
4. No campo **"Choose a tag"**, selecione a tag que você acabou de enviar (ex: `v1.0.0`).
5. Use a própria tag como **"Release title"** (ex: `v1.0.0`).
6. No campo de descrição, **copie e cole as alterações correspondentes do `CHANGELOG.md`**. Isso torna fácil para todos verem o que há de novo.
7. Clique em **"Publish release"**.

Pronto! Sua nova release está publicada.
