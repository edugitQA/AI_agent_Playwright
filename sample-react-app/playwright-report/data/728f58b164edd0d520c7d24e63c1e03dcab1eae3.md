# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - img [ref=e6]
    - generic [ref=e9]: Sistema de Login
    - generic [ref=e10]: Faça login para acessar o sistema
  - generic [ref=e11]:
    - alert [ref=e12]:
      - img [ref=e13]
      - generic [ref=e17]: Credenciais inválidas. Use admin/password123
    - generic [ref=e18]:
      - text: Usuário
      - generic [ref=e19]:
        - img [ref=e20]
        - textbox "Usuário" [ref=e23]:
          - /placeholder: Digite seu usuário
    - generic [ref=e24]:
      - text: Senha
      - generic [ref=e25]:
        - img [ref=e26]
        - textbox "Senha" [ref=e29]:
          - /placeholder: Digite sua senha
          - text: password123
    - button "Entrar" [active] [ref=e30]
    - button "Criar Nova Conta" [ref=e31]:
      - img
      - text: Criar Nova Conta
    - generic [ref=e32]:
      - paragraph [ref=e33]: "Credenciais de teste:"
      - paragraph [ref=e34]:
        - strong [ref=e35]: "Usuário:"
        - text: admin
      - paragraph [ref=e36]:
        - strong [ref=e37]: "Senha:"
        - text: password123
```