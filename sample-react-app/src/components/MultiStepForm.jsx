import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  User, 
  CreditCard, 
  Settings,
  ShoppingBag
} from 'lucide-react'

export function MultiStepForm({ onBackToDashboard }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Step 2: Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Step 3: Payment
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    
    // Step 4: Preferences
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    newsletter: false,
    terms: false
  })

  const [errors, setErrors] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)

  const steps = [
    { 
      number: 1, 
      title: 'Informações Pessoais', 
      icon: User,
      description: 'Dados básicos do usuário'
    },
    { 
      number: 2, 
      title: 'Endereço', 
      icon: Settings,
      description: 'Informações de localização'
    },
    { 
      number: 3, 
      title: 'Pagamento', 
      icon: CreditCard,
      description: 'Dados do cartão de crédito'
    },
    { 
      number: 4, 
      title: 'Preferências', 
      icon: ShoppingBag,
      description: 'Configurações da conta'
    }
  ]

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'Nome é obrigatório'
        if (!formData.lastName.trim()) newErrors.lastName = 'Sobrenome é obrigatório'
        if (!formData.email.trim()) newErrors.email = 'Email é obrigatório'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido'
        break
      
      case 2:
        if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório'
        if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória'
        if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório'
        if (!formData.zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório'
        break
      
      case 3:
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Número do cartão é obrigatório'
        if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Data de validade é obrigatória'
        if (!formData.cvv.trim()) newErrors.cvv = 'CVV é obrigatório'
        if (!formData.cardholderName.trim()) newErrors.cardholderName = 'Nome do portador é obrigatório'
        break
      
      case 4:
        if (!formData.terms) newErrors.terms = 'Você deve aceitar os termos de uso'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 4) {
        // Complete the form
        setIsCompleted(true)
      } else {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    setCurrentStep(Math.max(1, currentStep - 1))
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }))
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    handleInputChange('cardNumber', formatted)
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl text-green-700">Formulário Concluído!</CardTitle>
            <CardDescription>
              Parabéns, {formData.firstName}! Todos os dados foram preenchidos com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p><strong>Nome:</strong> {formData.firstName} {formData.lastName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Cidade:</strong> {formData.city}, {formData.state}</p>
              <p><strong>Cartão:</strong> **** **** **** {formData.cardNumber.slice(-4)}</p>
            </div>
            <Button 
              onClick={onBackToDashboard} 
              className="w-full"
              data-testid="multistep-success-back"
            >
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome *</label>
                <Input
                  placeholder="Seu nome"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  data-testid="multistep-first-name"
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sobrenome *</label>
                <Input
                  placeholder="Seu sobrenome"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  data-testid="multistep-last-name"
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                data-testid="multistep-email"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Telefone</label>
              <Input
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                data-testid="multistep-phone"
              />
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Endereço *</label>
              <Input
                placeholder="Rua, número, complemento"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                data-testid="multistep-address"
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cidade *</label>
                <Input
                  placeholder="Sua cidade"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  data-testid="multistep-city"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="text-xs text-red-500">{errors.city}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado *</label>
                <Input
                  placeholder="Seu estado"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  data-testid="multistep-state"
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && (
                  <p className="text-xs text-red-500">{errors.state}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">CEP *</label>
                <Input
                  placeholder="00000-000"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  data-testid="multistep-zipcode"
                  className={errors.zipCode ? 'border-red-500' : ''}
                />
                {errors.zipCode && (
                  <p className="text-xs text-red-500">{errors.zipCode}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">País</label>
                <Input
                  placeholder="Brasil"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  data-testid="multistep-country"
                />
              </div>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Número do Cartão *</label>
              <Input
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                data-testid="multistep-card-number"
                className={errors.cardNumber ? 'border-red-500' : ''}
              />
              {errors.cardNumber && (
                <p className="text-xs text-red-500">{errors.cardNumber}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data de Validade *</label>
                <Input
                  placeholder="MM/AA"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  data-testid="multistep-expiry-date"
                  className={errors.expiryDate ? 'border-red-500' : ''}
                />
                {errors.expiryDate && (
                  <p className="text-xs text-red-500">{errors.expiryDate}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">CVV *</label>
                <Input
                  placeholder="123"
                  maxLength={4}
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  data-testid="multistep-cvv"
                  className={errors.cvv ? 'border-red-500' : ''}
                />
                {errors.cvv && (
                  <p className="text-xs text-red-500">{errors.cvv}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Portador *</label>
              <Input
                placeholder="Nome como está no cartão"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                data-testid="multistep-cardholder-name"
                className={errors.cardholderName ? 'border-red-500' : ''}
              />
              {errors.cardholderName && (
                <p className="text-xs text-red-500">{errors.cardholderName}</p>
              )}
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notificações</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="email-notifications"
                    checked={formData.notifications.email}
                    onChange={(e) => handleNestedInputChange('notifications', 'email', e.target.checked)}
                    data-testid="multistep-email-notifications"
                  />
                  <label htmlFor="email-notifications" className="text-sm">
                    Notificações por email
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sms-notifications"
                    checked={formData.notifications.sms}
                    onChange={(e) => handleNestedInputChange('notifications', 'sms', e.target.checked)}
                    data-testid="multistep-sms-notifications"
                  />
                  <label htmlFor="sms-notifications" className="text-sm">
                    Notificações por SMS
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="push-notifications"
                    checked={formData.notifications.push}
                    onChange={(e) => handleNestedInputChange('notifications', 'push', e.target.checked)}
                    data-testid="multistep-push-notifications"
                  />
                  <label htmlFor="push-notifications" className="text-sm">
                    Notificações push
                  </label>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={formData.newsletter}
                  onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                  data-testid="multistep-newsletter"
                />
                <label htmlFor="newsletter" className="text-sm">
                  Desejo receber newsletter
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.terms}
                  onChange={(e) => handleInputChange('terms', e.target.checked)}
                  data-testid="multistep-terms"
                  className={errors.terms ? 'border-red-500' : ''}
                />
                <label htmlFor="terms" className="text-sm">
                  Aceito os termos de uso e política de privacidade *
                </label>
              </div>
              {errors.terms && (
                <p className="text-xs text-red-500">{errors.terms}</p>
              )}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Formulário Multi-Step</h1>
            <p className="text-gray-600">Complete todas as etapas para finalizar o cadastro</p>
          </div>
          <Button 
            onClick={onBackToDashboard} 
            variant="outline"
            data-testid="multistep-back-to-dashboard"
          >
            Voltar ao Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Etapa {currentStep} de {steps.length}</CardTitle>
              <Badge variant="secondary" data-testid="current-step-badge">
                {Math.round((currentStep / steps.length) * 100)}% Concluído
              </Badge>
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="w-full" />
            
            {/* Step Indicators */}
            <div className="flex justify-between mt-6">
              {steps.map((step) => {
                const IconComponent = step.icon
                const isCompleted = currentStep > step.number
                const isCurrent = currentStep === step.number
                
                return (
                  <div key={step.number} className="flex flex-col items-center space-y-2">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isCompleted ? 'bg-green-500 text-white' : 
                        isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <IconComponent className="h-5 w-5" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {steps[currentStep - 1].title}
              </h2>
              {renderStepContent()}
            </div>
            
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                data-testid="multistep-previous"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              
              <Button
                onClick={handleNext}
                data-testid="multistep-next"
              >
                {currentStep === steps.length ? 'Finalizar' : 'Próximo'}
                {currentStep < steps.length && <ChevronRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
