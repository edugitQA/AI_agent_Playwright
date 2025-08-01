import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { User, Mail, Lock, Calendar, CheckCircle, XCircle } from 'lucide-react'

export function UserRegistration({ onBackToLogin, onRegistrationSuccess }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    country: '',
    agreeToTerms: false,
    receiveNewsletter: false
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const countries = [
    'Brasil',
    'Estados Unidos',
    'Canadá',
    'Reino Unido',
    'França',
    'Alemanha',
    'Espanha',
    'Portugal',
    'Argentina',
    'México'
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nome é obrigatório'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória'
    }

    if (!formData.country) {
      newErrors.country = 'País é obrigatório'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Você deve aceitar os termos de uso'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    // Simula chamada de API
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
      
      // Após 2 segundos, chama o callback de sucesso
      setTimeout(() => {
        onRegistrationSuccess && onRegistrationSuccess(formData)
      }, 2000)
    }, 1500)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl text-green-700">Cadastro Realizado!</CardTitle>
            <CardDescription>
              Bem-vindo(a), {formData.firstName}! Seu cadastro foi realizado com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-gray-600 mb-4">
              Redirecionando para o login...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <User className="mx-auto h-12 w-12 text-purple-500 mb-4" />
          <CardTitle className="text-2xl">Criar Nova Conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  Nome *
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Seu nome"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  data-testid="register-first-name"
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500" data-testid="first-name-error">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Sobrenome *
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Seu sobrenome"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  data-testid="register-last-name"
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500" data-testid="last-name-error">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  data-testid="register-email"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500" data-testid="email-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Crie uma senha"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                  data-testid="register-password"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500" data-testid="password-error">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar Senha *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  data-testid="register-confirm-password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500" data-testid="confirm-password-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="birthDate" className="text-sm font-medium">
                Data de Nascimento *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className={`pl-10 ${errors.birthDate ? 'border-red-500' : ''}`}
                  data-testid="register-birth-date"
                />
              </div>
              {errors.birthDate && (
                <p className="text-xs text-red-500" data-testid="birth-date-error">
                  {errors.birthDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">País *</label>
              <Select 
                value={formData.country} 
                onValueChange={(value) => handleInputChange('country', value)}
              >
                <SelectTrigger 
                  className={errors.country ? 'border-red-500' : ''}
                  data-testid="register-country-select"
                >
                  <SelectValue placeholder="Selecione seu país" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country} data-testid={`country-option-${country.toLowerCase().replace(/\s+/g, '-')}`}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-xs text-red-500" data-testid="country-error">
                  {errors.country}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                  data-testid="register-agree-terms"
                />
                <label htmlFor="agreeToTerms" className="text-sm">
                  Aceito os <span className="text-purple-600 underline cursor-pointer">termos de uso</span> *
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-xs text-red-500" data-testid="terms-error">
                  {errors.agreeToTerms}
                </p>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="receiveNewsletter"
                  checked={formData.receiveNewsletter}
                  onCheckedChange={(checked) => handleInputChange('receiveNewsletter', checked)}
                  data-testid="register-newsletter"
                />
                <label htmlFor="receiveNewsletter" className="text-sm">
                  Desejo receber newsletters e promoções
                </label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
              data-testid="register-submit-button"
            >
              {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
            </Button>

            <Button 
              type="button"
              variant="outline" 
              className="w-full"
              onClick={onBackToLogin}
              data-testid="back-to-login-button"
            >
              Voltar ao Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
