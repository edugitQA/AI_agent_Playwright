import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Label } from '@/components/ui/label.jsx'
import { 
  Mail, 
  Phone, 
  User, 
  MessageSquare, 
  CheckCircle, 
  Send,
  AlertCircle 
} from 'lucide-react'

export function ContactForm({ onBackToDashboard }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    department: '',
    priority: 'medium',
    message: '',
    contactMethod: 'email'
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const departments = [
    'Vendas',
    'Suporte Técnico',
    'Financeiro',
    'Recursos Humanos',
    'Marketing',
    'Outros'
  ]

  const subjects = [
    'Dúvida sobre produto',
    'Problema técnico',
    'Reclamação',
    'Sugestão',
    'Parcerias',
    'Outros'
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (formData.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido. Use o formato (11) 99999-9999'
    }

    if (!formData.subject) {
      newErrors.subject = 'Assunto é obrigatório'
    }

    if (!formData.department) {
      newErrors.department = 'Departamento é obrigatório'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Mensagem deve ter pelo menos 10 caracteres'
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Mensagem deve ter no máximo 1000 caracteres'
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
    
    // Simula envio da mensagem
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
    }, 2000)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatPhoneNumber = (value) => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '')
    
    // Aplica a máscara (11) 99999-9999
    if (digits.length <= 2) {
      return `(${digits}`
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
    }
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    handleInputChange('phone', formatted)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl text-green-700">Mensagem Enviada!</CardTitle>
            <CardDescription>
              Obrigado, {formData.name}! Sua mensagem foi enviada com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Protocolo:</strong> #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                <br />
                <strong>Departamento:</strong> {formData.department}
                <br />
                <strong>Prioridade:</strong> {formData.priority === 'high' ? 'Alta' : formData.priority === 'medium' ? 'Média' : 'Baixa'}
              </AlertDescription>
            </Alert>
            <p className="text-center text-sm text-gray-600">
              Entraremos em contato em até 24 horas via {formData.contactMethod === 'email' ? 'email' : 'telefone'}.
            </p>
            <Button 
              onClick={onBackToDashboard} 
              className="w-full"
              data-testid="back-to-dashboard-success"
            >
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Fale Conosco</h1>
            <p className="text-gray-600">Envie sua mensagem e retornaremos em breve</p>
          </div>
          <Button 
            onClick={onBackToDashboard} 
            variant="outline"
            data-testid="back-to-dashboard-button"
          >
            Voltar ao Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-orange-500 mb-4" />
            <CardTitle className="text-2xl">Formulário de Contato</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para entrar em contato conosco
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Informações Pessoais</h3>
                
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                      data-testid="contact-name"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500" data-testid="name-error">
                      {errors.name}
                    </p>
                  )}
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
                      data-testid="contact-email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500" data-testid="email-error">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Telefone (Opcional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                      data-testid="contact-phone"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500" data-testid="phone-error">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Detalhes da Solicitação */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Detalhes da Solicitação</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assunto *</label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                      <SelectTrigger 
                        className={errors.subject ? 'border-red-500' : ''}
                        data-testid="contact-subject"
                      >
                        <SelectValue placeholder="Selecione o assunto" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem 
                            key={subject} 
                            value={subject}
                            data-testid={`subject-${subject.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subject && (
                      <p className="text-xs text-red-500" data-testid="subject-error">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Departamento *</label>
                    <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                      <SelectTrigger 
                        className={errors.department ? 'border-red-500' : ''}
                        data-testid="contact-department"
                      >
                        <SelectValue placeholder="Selecione o departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem 
                            key={dept} 
                            value={dept}
                            data-testid={`department-${dept.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.department && (
                      <p className="text-xs text-red-500" data-testid="department-error">
                        {errors.department}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Prioridade</label>
                  <RadioGroup 
                    value={formData.priority} 
                    onValueChange={(value) => handleInputChange('priority', value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="priority-low" data-testid="priority-low" />
                      <Label htmlFor="priority-low">Baixa</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="priority-medium" data-testid="priority-medium" />
                      <Label htmlFor="priority-medium">Média</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="priority-high" data-testid="priority-high" />
                      <Label htmlFor="priority-high">Alta</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Método de Contato Preferido</label>
                  <RadioGroup 
                    value={formData.contactMethod} 
                    onValueChange={(value) => handleInputChange('contactMethod', value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="contact-email" data-testid="contact-method-email" />
                      <Label htmlFor="contact-email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="contact-phone" data-testid="contact-method-phone" />
                      <Label htmlFor="contact-phone">Telefone</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Mensagem */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Mensagem *
                </label>
                <Textarea
                  id="message"
                  placeholder="Descreva detalhadamente sua solicitação..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className={`min-h-32 ${errors.message ? 'border-red-500' : ''}`}
                  data-testid="contact-message"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formData.message.length}/1000 caracteres</span>
                  {errors.message && (
                    <span className="text-red-500" data-testid="message-error">
                      {errors.message}
                    </span>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
                data-testid="contact-submit-button"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Enviando mensagem...' : 'Enviar Mensagem'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
