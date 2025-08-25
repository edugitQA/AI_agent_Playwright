import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { CheckCircle, XCircle, User, Lock, UserPlus } from 'lucide-react'
import { UserRegistration } from '@/components/UserRegistration.jsx'
import { ProductList } from '@/components/ProductList.jsx'
import { ContactForm } from '@/components/ContactForm.jsx'
import { UserManagement } from '@/components/UserManagement.jsx'
import { MultiStepForm } from '@/components/MultiStepForm.jsx'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [showWelcome, setShowWelcome] = useState(false)
  const [currentView, setCurrentView] = useState('login') // 'login', 'register', 'welcome', 'dashboard', 'products', 'contact', 'users', 'multistep'

  // Simula um processo de login
  const handleLogin = () => {
    setLoginError('')
    
    // Simula validação de credenciais
    if (username === 'admin' && password === 'password123') {
      setIsLoggedIn(true)
      setCurrentView('welcome')
      setShowWelcome(true)
    } else {
      setLoginError('Credenciais inválidas. Use admin/password123')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowWelcome(false)
    setCurrentView('login')
    setUsername('')
    setPassword('')
    setLoginError('')
  }

  const showDashboard = () => {
    setShowWelcome(false)
    setCurrentView('dashboard')
  }

  const showRegistration = () => {
    setCurrentView('register')
  }

  const handleRegistrationSuccess = (userData) => {
    // Aqui você poderia salvar os dados do usuário
    console.log('Usuário registrado:', userData)
    setCurrentView('login')
  }

  const backToLogin = () => {
    setCurrentView('login')
  }

  // Navegação para diferentes seções
  const navigateToProducts = () => setCurrentView('products')
  const navigateToContact = () => setCurrentView('contact')
  const navigateToUsers = () => setCurrentView('users')
  const navigateToMultiStep = () => setCurrentView('multistep')
  const backToDashboard = () => setCurrentView('dashboard')

  // Renderização condicional baseada na view atual
  if (currentView === 'register') {
    return (
      <UserRegistration 
        onBackToLogin={backToLogin}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    )
  }

  if (currentView === 'products' && isLoggedIn) {
    return <ProductList onBackToDashboard={backToDashboard} />
  }

  if (currentView === 'contact' && isLoggedIn) {
    return <ContactForm onBackToDashboard={backToDashboard} />
  }

  if (currentView === 'users' && isLoggedIn) {
    return <UserManagement onBackToDashboard={backToDashboard} />
  }

  if (currentView === 'multistep' && isLoggedIn) {
    return <MultiStepForm onBackToDashboard={backToDashboard} />
  }

  if (currentView === 'multistep' && isLoggedIn) {
    return <MultiStepForm onBackToDashboard={backToDashboard} />
  }

  if (isLoggedIn && currentView === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl text-green-700">Login Realizado com Sucesso!</CardTitle>
            <CardDescription>
              Bem-vindo, {username}! Você foi autenticado com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={showDashboard} 
              className="w-full"
              data-testid="dashboard-button"
            >
              Ir para o Dashboard
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="w-full"
              data-testid="logout-button"
            >
              Fazer Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoggedIn && currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard do Usuário</h1>
            <Button 
              onClick={handleLogout} 
              variant="outline"
              data-testid="header-logout-button"
            >
              Logout
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
                <CardDescription>Resumo das suas atividades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">42</div>
                <p className="text-sm text-gray-600">Tarefas completadas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Projetos</CardTitle>
                <CardDescription>Seus projetos ativos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">8</div>
                <p className="text-sm text-gray-600">Projetos em andamento</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>Mensagens recentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">3</div>
                <p className="text-sm text-gray-600">Novas mensagens</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Funcionalidades principais do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="w-full" 
                  onClick={navigateToProducts}
                  data-testid="create-project-button"
                >
                  Ver Produtos
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={navigateToContact}
                  data-testid="view-reports-button"
                >
                  Fale Conosco
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={navigateToUsers}
                  data-testid="manage-users-button"
                >
                  Gerenciar Usuários
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={navigateToMultiStep}
                  data-testid="settings-button"
                >
                  Formulário Multi-Step
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <User className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <CardTitle className="text-2xl">Sistema de Login</CardTitle>
          <CardDescription>
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loginError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription data-testid="error-message">
                {loginError}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Usuário
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                data-testid="username-input"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                data-testid="password-input-old"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleLogin} 
            className="w-full"
            data-testid="login-button-old"
          >
            Entrar
          </Button>

          <Button 
            onClick={showRegistration}
            variant="outline" 
            className="w-full"
            data-testid="register-button"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Criar Nova Conta
          </Button>
          
          <div className="text-center text-sm text-gray-600">
            <p>Credenciais de teste:</p>
            <p><strong>Usuário:</strong> admin</p>
            <p><strong>Senha:</strong> password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
