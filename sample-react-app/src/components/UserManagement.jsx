import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.jsx'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  Trash2, 
  Edit, 
  Plus, 
  Search, 
  UserCheck, 
  UserX,
  Mail,
  Calendar,
  Filter
} from 'lucide-react'

export function UserManagement({ onBackToDashboard }) {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@email.com',
      role: 'Admin',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2024-08-01'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      role: 'Editor',
      status: 'active',
      createdAt: '2024-02-20',
      lastLogin: '2024-07-30'
    },
    {
      id: 3,
      name: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      role: 'Viewer',
      status: 'inactive',
      createdAt: '2024-03-10',
      lastLogin: '2024-06-15'
    },
    {
      id: 4,
      name: 'Ana Oliveira',
      email: 'ana.oliveira@email.com',
      role: 'Editor',
      status: 'active',
      createdAt: '2024-04-05',
      lastLogin: '2024-08-01'
    },
    {
      id: 5,
      name: 'Carlos Ferreira',
      email: 'carlos.ferreira@email.com',
      role: 'Viewer',
      status: 'pending',
      createdAt: '2024-07-25',
      lastLogin: null
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [userToDelete, setUserToDelete] = useState(null)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  const roles = ['Admin', 'Editor', 'Viewer']
  const statuses = [
    { value: 'active', label: 'Ativo', color: 'bg-green-500' },
    { value: 'inactive', label: 'Inativo', color: 'bg-gray-500' },
    { value: 'pending', label: 'Pendente', color: 'bg-yellow-500' }
  ]

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesStatus && matchesRole
  })

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
    setUserToDelete(null)
  }

  const handleStatusChange = (userId, newStatus) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ))
  }

  const handleRoleChange = (userId, newRole) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ))
  }

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id))
    }
  }

  const handleBulkDelete = () => {
    setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)))
    setSelectedUsers([])
    setShowBulkActions(false)
  }

  const handleBulkStatusChange = (newStatus) => {
    setUsers(prev => prev.map(user => 
      selectedUsers.includes(user.id) ? { ...user, status: newStatus } : user
    ))
    setSelectedUsers([])
    setShowBulkActions(false)
  }

  useEffect(() => {
    setShowBulkActions(selectedUsers.length > 0)
  }, [selectedUsers])

  const getStatusBadge = (status) => {
    const statusConfig = statuses.find(s => s.value === status)
    return (
      <Badge className={`${statusConfig.color} text-white`}>
        {statusConfig.label}
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gerenciar Usuários</h1>
            <p className="text-gray-600">Controle de usuários e permissões do sistema</p>
          </div>
          <Button 
            onClick={onBackToDashboard} 
            variant="outline"
            data-testid="back-to-dashboard-button"
          >
            Voltar ao Dashboard
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
                  <p className="text-sm text-gray-600">Usuários Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserX className="h-8 w-8 text-gray-500" />
                <div>
                  <p className="text-2xl font-bold">{users.filter(u => u.status === 'inactive').length}</p>
                  <p className="text-sm text-gray-600">Usuários Inativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{users.filter(u => u.status === 'pending').length}</p>
                  <p className="text-sm text-gray-600">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-gray-600">Total de Usuários</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Ações */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
              <div className="flex flex-1 gap-4">
                {/* Busca */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="user-search-input"
                  />
                </div>

                {/* Filtros */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40" data-testid="status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="status-all">Todos</SelectItem>
                    {statuses.map(status => (
                      <SelectItem 
                        key={status.value} 
                        value={status.value}
                        data-testid={`status-${status.value}`}
                      >
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40" data-testid="role-filter">
                    <SelectValue placeholder="Função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="role-all">Todas</SelectItem>
                    {roles.map(role => (
                      <SelectItem 
                        key={role} 
                        value={role}
                        data-testid={`role-${role.toLowerCase()}`}
                      >
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex items-center gap-2"
                  data-testid="add-user-button"
                >
                  <Plus className="h-4 w-4" />
                  Novo Usuário
                </Button>
              </div>
            </div>

            {/* Ações em Lote */}
            {showBulkActions && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedUsers.length} usuário(s) selecionado(s)
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleBulkStatusChange('active')}
                      data-testid="bulk-activate-button"
                    >
                      Ativar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleBulkStatusChange('inactive')}
                      data-testid="bulk-deactivate-button"
                    >
                      Desativar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          data-testid="bulk-delete-button"
                        >
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir {selectedUsers.length} usuário(s)? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-testid="bulk-delete-cancel">Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleBulkDelete}
                            data-testid="bulk-delete-confirm"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabela de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários ({filteredUsers.length})</CardTitle>
            <CardDescription>
              Gerencie usuários, funções e permissões do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={selectAllUsers}
                      className="rounded"
                      data-testid="select-all-users"
                    />
                  </TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded"
                        data-testid={`select-user-${user.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select 
                        value={user.role} 
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                      >
                        <SelectTrigger 
                          className="w-24"
                          data-testid={`role-select-${user.id}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem 
                              key={role} 
                              value={role}
                              data-testid={`role-option-${role.toLowerCase()}-${user.id}`}
                            >
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={user.status} 
                        onValueChange={(value) => handleStatusChange(user.id, value)}
                      >
                        <SelectTrigger 
                          className="w-32"
                          data-testid={`status-select-${user.id}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map(status => (
                            <SelectItem 
                              key={status.value} 
                              value={status.value}
                              data-testid={`status-option-${status.value}-${user.id}`}
                            >
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          data-testid={`edit-user-${user.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              data-testid={`delete-user-${user.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o usuário <strong>{user.name}</strong>? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel data-testid={`delete-cancel-${user.id}`}>
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteUser(user.id)}
                                data-testid={`delete-confirm-${user.id}`}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500" data-testid="no-users-message">
                  Nenhum usuário encontrado com os filtros aplicados.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
