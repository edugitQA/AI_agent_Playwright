// File: tests/pages/ProductListPage.ts

import { type Page } from '@playwright/test';
const { SelfHealingTestRunner } = require('../../agent/self_healing_runner.js');

export class ProductListPage {
    private runner: typeof SelfHealingTestRunner.prototype;

    // Mapeamento dos seletores da página de produtos
    private selectors = {
        searchInput: '[data-testid="search-products"]',
        categoryFilter: '[data-testid="filter-category"]',
        priceFilter: '[data-testid="filter-price"]',
        sortSelect: '[data-testid="sort-products"]',
        productCard: '[data-testid^="product-card-"]',
        addToCartButton: '[data-testid^="add-to-cart-"]',
        cartIcon: '[data-testid="cart-icon"]',
        cartCount: '[data-testid="cart-count"]',
        clearFiltersButton: '[data-testid="clear-filters"]',
        backToDashboardButton: '[data-testid="back-to-dashboard"]',
        prevPageButton: '[data-testid="prev-page"]',
        nextPageButton: '[data-testid="next-page"]',
        pageInfo: '[data-testid="page-info"]',
        noProductsMessage: '[data-testid="no-products"]'
    };

    constructor(private page: Page) {
        this.runner = new SelfHealingTestRunner(page);
    }

    // Método auxiliar para o agente atualizar nosso mapa
    private updateSelector(key: keyof typeof this.selectors, newSelector: string) {
        console.log(`[Auto-Correção] Atualizando seletor '${key}' para: ${newSelector}`);
        this.selectors[key] = newSelector;
    }

    // Navegar para a página de produtos
    async navigateToProducts() {
        try {
            // Assumindo que já estamos logados e no dashboard
            await this.page.click('[data-testid="create-project-button"]');
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            console.error(`❌ Erro ao navegar para produtos: ${error}`);
            throw error;
        }
    }

    // Pesquisar produtos
    async searchProducts(searchTerm: string) {
        try {
            await this.page.locator(this.selectors.searchInput).fill(searchTerm);
            // Aguardar a pesquisa ser aplicada
            await this.page.waitForTimeout(500);
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'searchInput',
                this.selectors.searchInput,
                'Campo de busca para pesquisar produtos com placeholder "Pesquisar produtos..."'
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

    // Filtrar por categoria
    async filterByCategory(category: string) {
        try {
            await this.page.locator(this.selectors.categoryFilter).click();
            await this.page.locator(`[data-testid="category-${category.toLowerCase()}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'categoryFilter',
                this.selectors.categoryFilter,
                'Seletor dropdown para filtrar produtos por categoria'
            );
            if (healedSelector) {
                this.updateSelector('categoryFilter', healedSelector);
                await this.page.locator(this.selectors.categoryFilter).click();
                await this.page.locator(`[data-testid="category-${category.toLowerCase()}"]`).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para filtro de categoria');
            }
        }
    }

    // Filtrar por preço
    async filterByPrice(priceRange: string) {
        try {
            await this.page.locator(this.selectors.priceFilter).click();
            await this.page.locator(`[data-testid="price-${priceRange}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'priceFilter',
                this.selectors.priceFilter,
                'Seletor dropdown para filtrar produtos por faixa de preço'
            );
            if (healedSelector) {
                this.updateSelector('priceFilter', healedSelector);
                await this.page.locator(this.selectors.priceFilter).click();
                await this.page.locator(`[data-testid="price-${priceRange}"]`).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para filtro de preço');
            }
        }
    }

    // Ordenar produtos
    async sortProducts(sortBy: string) {
        try {
            await this.page.locator(this.selectors.sortSelect).click();
            await this.page.locator(`[data-testid="sort-${sortBy}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'sortSelect',
                this.selectors.sortSelect,
                'Seletor dropdown para ordenar produtos por diferentes critérios'
            );
            if (healedSelector) {
                this.updateSelector('sortSelect', healedSelector);
                await this.page.locator(this.selectors.sortSelect).click();
                await this.page.locator(`[data-testid="sort-${sortBy}"]`).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para ordenação');
            }
        }
    }

    // Adicionar produto ao carrinho
    async addProductToCart(productIndex: number) {
        try {
            await this.page.locator(`[data-testid="add-to-cart-${productIndex}"]`).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'addToCartButton',
                `[data-testid="add-to-cart-${productIndex}"]`,
                `Botão para adicionar produto ${productIndex} ao carrinho com texto "Adicionar ao Carrinho"`
            );
            if (healedSelector) {
                await this.page.locator(healedSelector).click();
            } else {
                throw new Error(`Sistema de auto-correção falhou ao encontrar seletor para adicionar produto ${productIndex} ao carrinho`);
            }
        }
    }

    // Limpar filtros
    async clearFilters() {
        try {
            await this.page.locator(this.selectors.clearFiltersButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'clearFiltersButton',
                this.selectors.clearFiltersButton,
                'Botão para limpar todos os filtros aplicados com texto "Limpar Filtros"'
            );
            if (healedSelector) {
                this.updateSelector('clearFiltersButton', healedSelector);
                await this.page.locator(this.selectors.clearFiltersButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para limpar filtros');
            }
        }
    }

    // Navegar para próxima página
    async goToNextPage() {
        try {
            await this.page.locator(this.selectors.nextPageButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'nextPageButton',
                this.selectors.nextPageButton,
                'Botão para navegar para próxima página de produtos'
            );
            if (healedSelector) {
                this.updateSelector('nextPageButton', healedSelector);
                await this.page.locator(this.selectors.nextPageButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para próxima página');
            }
        }
    }

    // Navegar para página anterior
    async goToPrevPage() {
        try {
            await this.page.locator(this.selectors.prevPageButton).click();
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'prevPageButton',
                this.selectors.prevPageButton,
                'Botão para navegar para página anterior de produtos'
            );
            if (healedSelector) {
                this.updateSelector('prevPageButton', healedSelector);
                await this.page.locator(this.selectors.prevPageButton).click();
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para página anterior');
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

    // Verificar número de itens no carrinho
    async getCartCount(): Promise<string> {
        try {
            return await this.page.locator(this.selectors.cartCount).textContent() || '0';
        } catch (error) {
            const healedSelector = await this.runner.healBrokenSelector(
                'cartCount',
                this.selectors.cartCount,
                'Contador de itens no carrinho de compras'
            );
            if (healedSelector) {
                this.updateSelector('cartCount', healedSelector);
                return await this.page.locator(this.selectors.cartCount).textContent() || '0';
            } else {
                throw new Error('Sistema de auto-correção falhou ao encontrar seletor para contador do carrinho');
            }
        }
    }

    // Verificar se produtos estão visíveis
    async areProductsVisible(): Promise<boolean> {
        try {
            return await this.page.locator(this.selectors.productCard).first().isVisible();
        } catch (error) {
            return false;
        }
    }

    // Verificar mensagem de nenhum produto encontrado
    async isNoProductsMessageVisible(): Promise<boolean> {
        try {
            return await this.page.locator(this.selectors.noProductsMessage).isVisible();
        } catch (error) {
            return false;
        }
    }

    // Obter informação da página atual
    async getPageInfo(): Promise<string> {
        try {
            return await this.page.locator(this.selectors.pageInfo).textContent() || '';
        } catch (error) {
            return '';
        }
    }

    // Obter seletor atual
    getSelector(selectorName: keyof typeof this.selectors): string {
        return this.selectors[selectorName];
    }
}
