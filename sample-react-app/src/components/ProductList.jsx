import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react'

export function ProductList({ onBackToDashboard }) {
  const [products] = useState([
    {
      id: 1,
      name: 'Smartphone Galaxy Pro',
      price: 899.99,
      category: 'Eletrônicos',
      rating: 4.5,
      inStock: true,
      image: '📱',
      description: 'Smartphone de última geração com câmera profissional'
    },
    {
      id: 2,
      name: 'Laptop UltraBook',
      price: 1299.99,
      category: 'Computadores',
      rating: 4.8,
      inStock: true,
      image: '💻',
      description: 'Laptop leve e potente para trabalho e jogos'
    },
    {
      id: 3,
      name: 'Fone Bluetooth Premium',
      price: 199.99,
      category: 'Áudio',
      rating: 4.3,
      inStock: false,
      image: '🎧',
      description: 'Fone com cancelamento de ruído ativo'
    },
    {
      id: 4,
      name: 'Smart TV 55"',
      price: 649.99,
      category: 'Eletrônicos',
      rating: 4.6,
      inStock: true,
      image: '📺',
      description: 'Smart TV 4K com HDR e sistema Android'
    },
    {
      id: 5,
      name: 'Tablet Pro 12"',
      price: 799.99,
      category: 'Tablets',
      rating: 4.4,
      inStock: true,
      image: '📟',
      description: 'Tablet profissional com stylus incluído'
    },
    {
      id: 6,
      name: 'Camera DSLR',
      price: 1499.99,
      category: 'Fotografia',
      rating: 4.9,
      inStock: true,
      image: '📷',
      description: 'Câmera profissional com lentes intercambiáveis'
    },
    {
      id: 7,
      name: 'Smartwatch Fitness',
      price: 299.99,
      category: 'Wearables',
      rating: 4.2,
      inStock: true,
      image: '⌚',
      description: 'Relógio inteligente com monitoramento de saúde'
    },
    {
      id: 8,
      name: 'Console Gaming',
      price: 499.99,
      category: 'Games',
      rating: 4.7,
      inStock: false,
      image: '🎮',
      description: 'Console de jogos de nova geração'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [viewMode, setViewMode] = useState('grid') // 'grid' ou 'list'
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(4)
  const [cart, setCart] = useState([])
  const [showStockFilter, setShowStockFilter] = useState('all') // 'all', 'inStock', 'outOfStock'

  const categories = ['all', ...new Set(products.map(p => p.category))]

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesStock = showStockFilter === 'all' || 
                        (showStockFilter === 'inStock' && product.inStock) ||
                        (showStockFilter === 'outOfStock' && !product.inStock)
    
    return matchesSearch && matchesCategory && matchesStock
  })

  // Ordenar produtos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'price':
        comparison = a.price - b.price
        break
      case 'rating':
        comparison = a.rating - b.rating
        break
      default:
        comparison = 0
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })

  // Paginação
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  const addToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        className={`h-4 w-4 ${index < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Loja de Produtos</h1>
            <p className="text-gray-600">Encontre os melhores produtos com preços incríveis</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-lg" data-testid="cart-badge">
              🛒 {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </Badge>
            <Button 
              onClick={onBackToDashboard} 
              variant="outline"
              data-testid="back-to-dashboard-button"
            >
              Voltar ao Dashboard
            </Button>
          </div>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Busca */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="product-search-input"
                  />
                </div>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40" data-testid="category-filter">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem 
                        key={category} 
                        value={category}
                        data-testid={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {category === 'all' ? 'Todas' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={showStockFilter} onValueChange={setShowStockFilter}>
                  <SelectTrigger className="w-40" data-testid="stock-filter">
                    <SelectValue placeholder="Estoque" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="stock-all">Todos</SelectItem>
                    <SelectItem value="inStock" data-testid="stock-available">Disponível</SelectItem>
                    <SelectItem value="outOfStock" data-testid="stock-unavailable">Indisponível</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40" data-testid="sort-by-filter">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name" data-testid="sort-name">Nome</SelectItem>
                    <SelectItem value="price" data-testid="sort-price">Preço</SelectItem>
                    <SelectItem value="rating" data-testid="sort-rating">Avaliação</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  data-testid="sort-order-button"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>

                <div className="flex border rounded">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    data-testid="grid-view-button"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    data-testid="list-view-button"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Produtos */}
        {paginatedProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 text-lg" data-testid="no-products-message">
                Nenhum produto encontrado com os filtros aplicados.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
              : "space-y-4 mb-6"
          }>
            {paginatedProducts.map(product => (
              <Card 
                key={product.id} 
                className={`${viewMode === 'list' ? 'flex' : ''} hover:shadow-lg transition-shadow`}
                data-testid={`product-card-${product.id}`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <CardHeader className="text-center">
                      <div className="text-6xl mb-2">{product.image}</div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-center space-x-1">
                        {renderStars(product.rating)}
                        <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                      </div>
                      
                      <div className="text-center">
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>
                      
                      <div className="text-center">
                        <span className="text-2xl font-bold text-green-600">
                          R$ {product.price.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="text-center">
                        {product.inStock ? (
                          <Badge variant="default" className="bg-green-500">Em Estoque</Badge>
                        ) : (
                          <Badge variant="destructive">Fora de Estoque</Badge>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full"
                        disabled={!product.inStock}
                        onClick={() => addToCart(product)}
                        data-testid={`add-to-cart-${product.id}`}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
                      </Button>
                    </CardContent>
                  </>
                ) : (
                  <div className="flex w-full">
                    <div className="flex-shrink-0 p-6">
                      <div className="text-4xl">{product.image}</div>
                    </div>
                    <div className="flex-1 p-6">
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-1">
                          {renderStars(product.rating)}
                          <span className="text-sm text-gray-600">({product.rating})</span>
                        </div>
                        <Badge variant="secondary">{product.category}</Badge>
                        {product.inStock ? (
                          <Badge variant="default" className="bg-green-500">Em Estoque</Badge>
                        ) : (
                          <Badge variant="destructive">Fora de Estoque</Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-green-600">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <Button 
                          disabled={!product.inStock}
                          onClick={() => addToCart(product)}
                          data-testid={`add-to-cart-${product.id}`}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedProducts.length)} de {sortedProducts.length} produtos
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    data-testid="pagination-previous"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                      key={index + 1}
                      variant={currentPage === index + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(index + 1)}
                      data-testid={`pagination-page-${index + 1}`}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    data-testid="pagination-next"
                  >
                    Próximo
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
