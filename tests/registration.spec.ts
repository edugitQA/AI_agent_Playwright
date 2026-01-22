import { test, expect } from '@playwright/test';
import { RegistrationPage } from './pages/RegistrationPage';

test.describe('Formulário de Cadastro com Auto-Correção', () => {
  test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5174');
  await page.waitForLoadState('networkidle');
  });

  test('deve cadastrar um usuário com dados válidos', async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.fillFirstName('Usuário');
    await reg.fillLastName('Teste');
    await reg.fillEmail('teste+e2e@example.com');
    await reg.fillPassword('SenhaForte!234');
    await reg.fillConfirmPassword('SenhaForte!234');
    await reg.fillDob('1990-01-01');
    await reg.selectCountry('Brasil');
    await reg.toggleAcceptTerms(true);
    await reg.clickSubmit();

    // Verificar mensagem de sucesso ou redirecionamento
  const success = page.locator('text=Conta criada com sucesso');
  await expect(success).toBeVisible({ timeout: 8000 });
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    const reg = new RegistrationPage(page);
    // Apenas abrir e tentar submeter
    await reg.clickSubmit();

    // Verifica presença de mensagens de erro para campos obrigatórios
  await expect(page.locator('text=Nome é obrigatório')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('text=Email é obrigatório')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('text=Senha é obrigatória')).toBeVisible({ timeout: 5000 });
  });

  test('deve validar email inválido', async ({ page }) => {
    const reg = new RegistrationPage(page);
    await reg.fillFirstName('Usuário');
    await reg.fillLastName('Teste');
    await reg.fillEmail('email-invalido');
    await reg.fillPassword('SenhaForte!234');
    await reg.fillConfirmPassword('SenhaForte!234');
    await reg.toggleAcceptTerms(true);
    await reg.clickSubmit();

  await expect(page.locator('text=Informe um email válido')).toBeVisible({ timeout: 5000 });
  });
});
