// File: tests/pages/UserManagementPage.ts

import { type Page } from '@playwright/test';
const { SelfHealingTestRunner } = require('../../agent/self_healing_runner.js');

export class UserManagementPage {
    private runner: typeof SelfHealingTestRunner.prototype;

    // Mapeamento dos seletores da página de gerenciamento de usuários
    private selectors = {
        searchInput: '[data-testid="search-users"]',
        roleFilter: '[data-testid="filter-role"]',
        statusFilter: '[data-testid="filter-status"]',
        addUserButton: '[data-testid="add-user"]',
        bulkDeleteButton: '[data-testid="bulk-delete"]',
        selectAllCheckbox: '[data-testid="select-all"]',
        userRow: '[data-testid^="user-row-"]',
        userCheckbox: '[data-testid^="user-checkbox-"]',
        editUserButton: '[data-testid^="edit-user-"]',
        deleteUserButton: '[data-testid^="delete-user-"]',
        backToDashboardButton: '[data-testid="back-to-dashboard"]',
        
        // Modal de adição/edição de usuário
        modal: '[data-testid="user-modal"]',
        modalNameInput: '[data-testid="modal-name"]',
        modalEmailInput: '[data-testid="modal-email"]',
        modalRoleSelect: '[data-testid="modal-role"]',
        modalStatusSelect: '[data-testid="modal-status"]',
        modalSaveButton: '[data-testid="modal-save"]',
        modalCancelButton: '[data-testid="modal-cancel"]',
        
        // Modal de confirmação de exclusão
        deleteModal: '[data-testid="delete-modal"]',
        confirmDeleteButton: '[data-testid="confirm-delete"]',
        cancelDeleteButton: '[data-testid="cancel-delete"]',
        
        // Mensagens
        successMessage: '[data-testid="success-message"]',
        errorMessage: '[data-testid="error-message"]',
        noUsersMessage: '[data-testid="no-users"]'
    };

    constructor(private page: Page) {
        this.runner = new SelfHealingTestRunner(page);
    }

    // Método auxiliar para o agente atualizar nosso mapa
    private updateSelector(key: keyof typeof this.selectors, newSelector: string) {
        console.log(`[Auto-Correção] Atualizando seletor '${key}' para: ${newSelector}`);
        this.selectors[key] = newSelector;
    }

    // Navegar para a página de gerenciamento de usuários
    async navigateToUserManagement() {
        try {
            // Assumindo que já estamos logados e no dashboard
            await this.page.click('[data-testid="manage-users-button"]');
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            console.error(`❌ Erro ao navegar para gerenciamento de usuários: ${error}`);
            throw error;
        }
    }

    // Pesquisar usuários
    async searchUsers(searchTerm: string) {
        try {
            await this.page.locator(this.selectors.searchInput).fill(searchTerm);
            // Aguardar a pesquisa ser aplicada
            await this.page.waitForTimeout(500);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'searchInput',
                this.selectors.searchInput,
                'Campo de busca para pesquisar usuários com placeholder "Pesquisar usuários..."'
            );
            if (healedSelector) {
                this.updateSelector('searchInput', healedSelector);
                await this.page.locator(this.selectors.searchInput).fill(searchTerm);
                await this.page.waitForTimeout(500);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para campo de busca');
            }
        }
    }

    // Filtrar por role
    async filterByRole(role: string) {
        try {
            await this.page.locator(this.selectors.roleFilter).click();
            await this.page.locator(`[data-testid="role-${role.toLowerCase()}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'roleFilter',
                this.selectors.roleFilter,
                'Seletor dropdown para filtrar usuários por role/função'
            );
            if (healedSelector) {
                this.updateSelector('roleFilter', healedSelector);
                await this.page.locator(this.selectors.roleFilter).click();
                await this.page.locator(`[data-testid="role-${role.toLowerCase()}"]`).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para filtro de role');
            }
        }
    }

    // Filtrar por status
    async filterByStatus(status: string) {
        try {
            await this.page.locator(this.selectors.statusFilter).click();
            await this.page.locator(`[data-testid="status-${status.toLowerCase()}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'statusFilter',
                this.selectors.statusFilter,
                'Seletor dropdown para filtrar usuários por status (ativo/inativo)'
            );
            if (healedSelector) {
                this.updateSelector('statusFilter', healedSelector);
                await this.page.locator(this.selectors.statusFilter).click();
                await this.page.locator(`[data-testid="status-${status.toLowerCase()}"]`).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para filtro de status');
            }
        }
    }

    // Clicar no botão adicionar usuário
    async clickAddUser() {
        try {
            await this.page.locator(this.selectors.addUserButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'addUserButton',
                this.selectors.addUserButton,
                'Botão para adicionar novo usuário com texto "Adicionar Usuário"'
            );
            if (healedSelector) {
                this.updateSelector('addUserButton', healedSelector);
                await this.page.locator(this.selectors.addUserButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para botão adicionar usuário');
            }
        }
    }

    // Selecionar todos os usuários
    async selectAllUsers() {
        try {
            await this.page.locator(this.selectors.selectAllCheckbox).check();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'selectAllCheckbox',
                this.selectors.selectAllCheckbox,
                'Checkbox para selecionar todos os usuários na tabela'
            );
            if (healedSelector) {
                this.updateSelector('selectAllCheckbox', healedSelector);
                await this.page.locator(this.selectors.selectAllCheckbox).check();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para selecionar todos');
            }
        }
    }

    // Selecionar usuário específico
    async selectUser(userId: number) {
        try {
            await this.page.locator(`[data-testid="user-checkbox-${userId}"]`).check();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'userCheckbox',
                `[data-testid="user-checkbox-${userId}"]`,
                `Checkbox para selecionar usuário ${userId} na tabela`
            );
            if (healedSelector) {
                await this.page.locator(healedSelector).check();
            } else {
                throw new Error(`Sistema de auto-correção falhou ao encontrar seletor para checkbox do usuário ${userId}`);
            }
        }
    }

    // Editar usuário
    async editUser(userId: number) {
        try {
            await this.page.locator(`[data-testid="edit-user-${userId}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'editUserButton',
                `[data-testid="edit-user-${userId}"]`,
                `Botão para editar usuário ${userId} com ícone de edição`
            );
            if (healedSelector) {
                await this.page.locator(healedSelector).click();
            } else {
                throw new Error(`Sistema de auto-correção falhou ao encontrar seletor para editar usuário ${userId}`);
            }
        }
    }

    // Excluir usuário
    async deleteUser(userId: number) {
        try {
            await this.page.locator(`[data-testid="delete-user-${userId}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'deleteUserButton',
                `[data-testid="delete-user-${userId}"]`,
                `Botão para excluir usuário ${userId} com ícone de lixeira`
            );
            if (healedSelector) {
                await this.page.locator(healedSelector).click();
            } else {
                throw new Error(`Sistema de auto-correção falhou ao encontrar seletor para excluir usuário ${userId}`);
            }
        }
    }

    // Exclusão em lote
    async bulkDelete() {
        try {
            await this.page.locator(this.selectors.bulkDeleteButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'bulkDeleteButton',
                this.selectors.bulkDeleteButton,
                'Botão para excluir usuários selecionados em lote com texto "Excluir Selecionados"'
            );
            if (healedSelector) {
                this.updateSelector('bulkDeleteButton', healedSelector);
                await this.page.locator(this.selectors.bulkDeleteButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para exclusão em lote');
            }
        }
    }

    // Confirmar exclusão no modal
    async confirmDelete() {
        try {
            await this.page.locator(this.selectors.confirmDeleteButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'confirmDeleteButton',
                this.selectors.confirmDeleteButton,
                'Botão para confirmar exclusão no modal de confirmação com texto "Sim, Excluir"'
            );
            if (healedSelector) {
                this.updateSelector('confirmDeleteButton', healedSelector);
                await this.page.locator(this.selectors.confirmDeleteButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para confirmar exclusão');
            }
        }
    }

    // Cancelar exclusão no modal
    async cancelDelete() {
        try {
            await this.page.locator(this.selectors.cancelDeleteButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'cancelDeleteButton',
                this.selectors.cancelDeleteButton,
                'Botão para cancelar exclusão no modal de confirmação com texto "Cancelar"'
            );
            if (healedSelector) {
                this.updateSelector('cancelDeleteButton', healedSelector);
                await this.page.locator(this.selectors.cancelDeleteButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para cancelar exclusão');
            }
        }
    }

    // Preencher dados do usuário no modal
    async fillUserData(name: string, email: string, role: string, status: string) {
        // Preencher nome
        try {
            await this.page.locator(this.selectors.modalNameInput).fill(name);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'modalNameInput',
                this.selectors.modalNameInput,
                'Campo de texto para nome do usuário no modal de cadastro/edição'
            );
            if (healedSelector) {
                this.updateSelector('modalNameInput', healedSelector);
                await this.page.locator(this.selectors.modalNameInput).fill(name);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para campo nome no modal');
            }
        }

        // Preencher email
        try {
            await this.page.locator(this.selectors.modalEmailInput).fill(email);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'modalEmailInput',
                this.selectors.modalEmailInput,
                'Campo de texto para email do usuário no modal de cadastro/edição'
            );
            if (healedSelector) {
                this.updateSelector('modalEmailInput', healedSelector);
                await this.page.locator(this.selectors.modalEmailInput).fill(email);
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para campo email no modal');
            }
        }

        // Selecionar role
        try {
            await this.page.locator(this.selectors.modalRoleSelect).click();
            await this.page.locator(`[data-testid="modal-role-${role.toLowerCase()}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'modalRoleSelect',
                this.selectors.modalRoleSelect,
                'Seletor dropdown para role do usuário no modal de cadastro/edição'
            );
            if (healedSelector) {
                this.updateSelector('modalRoleSelect', healedSelector);
                await this.page.locator(this.selectors.modalRoleSelect).click();
                await this.page.locator(`[data-testid="modal-role-${role.toLowerCase()}"]`).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para role no modal');
            }
        }

        // Selecionar status
        try {
            await this.page.locator(this.selectors.modalStatusSelect).click();
            await this.page.locator(`[data-testid="modal-status-${status.toLowerCase()}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'modalStatusSelect',
                this.selectors.modalStatusSelect,
                'Seletor dropdown para status do usuário no modal de cadastro/edição'
            );
            if (healedSelector) {
                this.updateSelector('modalStatusSelect', healedSelector);
                await this.page.locator(this.selectors.modalStatusSelect).click();
                await this.page.locator(`[data-testid="modal-status-${status.toLowerCase()}"]`).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para status no modal');
            }
        }
    }

    // Salvar usuário no modal
    async saveUser() {
        try {
            await this.page.locator(this.selectors.modalSaveButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'modalSaveButton',
                this.selectors.modalSaveButton,
                'Botão para salvar usuário no modal com texto "Salvar"'
            );
            if (healedSelector) {
                this.updateSelector('modalSaveButton', healedSelector);
                await this.page.locator(this.selectors.modalSaveButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para salvar no modal');
            }
        }
    }

    // Cancelar no modal
    async cancelModal() {
        try {
            await this.page.locator(this.selectors.modalCancelButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'modalCancelButton',
                this.selectors.modalCancelButton,
                'Botão para cancelar no modal com texto "Cancelar"'
            );
            if (healedSelector) {
                this.updateSelector('modalCancelButton', healedSelector);
                await this.page.locator(this.selectors.modalCancelButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para cancelar no modal');
            }
        }
    }

    // Voltar ao dashboard
    async backToDashboard() {
        try {
            await this.page.locator(this.selectors.backToDashboardButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'backToDashboardButton',
                this.selectors.backToDashboardButton,
                'Botão para voltar ao dashboard com texto "Voltar ao Dashboard"'
            );
            if (healedSelector) {
                this.updateSelector('backToDashboardButton', healedSelector);
                await this.page.locator(this.selectors.backToDashboardButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para voltar ao dashboard');
            }
        }
    }

    // Verificar se modal está visível
    async isModalVisible(): Promise<boolean> {
        try {
            return await this.page.locator(this.selectors.modal).isVisible();
        } catch (error) {
            return false;
        }
    }

    // Verificar se modal de exclusão está visível
    async isDeleteModalVisible(): Promise<boolean> {
        try {
            return await this.page.locator(this.selectors.deleteModal).isVisible();
        } catch (error) {
            return false;
        }
    }

    // Verificar mensagem de sucesso
    async verifySuccessMessage(): Promise<boolean> {
        try {
            return await this.page.locator(this.selectors.successMessage).isVisible();
        } catch (error) {
            return false;
        }
    }

    // Verificar se usuários estão visíveis
    async areUsersVisible(): Promise<boolean> {
        try {
            return await this.page.locator(this.selectors.userRow).first().isVisible();
        } catch (error) {
            return false;
        }
    }

    // Obter seletor atual
    getSelector(selectorName: keyof typeof this.selectors): string {
        return this.selectors[selectorName];
    }
}
