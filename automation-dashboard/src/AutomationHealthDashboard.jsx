// automation-dashboard/src/AutomationHealthDashboard.jsx

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Componentes UI simples sem Tailwind
const Card = ({ children, className = '' }) => (
  <div className={`${className}`} style={{
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    marginBottom: '1rem'
  }}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div style={{ marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={className} style={{
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0'
  }}>
    {children}
  </h3>
);

const CardDescription = ({ children }) => (
  <p style={{
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0.25rem 0 0 0'
  }}>
    {children}
  </p>
);

const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

const Table = ({ children }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      {children}
    </table>
  </div>
);

const TableHeader = ({ children }) => (
  <thead style={{ backgroundColor: '#f9fafb' }}>
    {children}
  </thead>
);

const TableRow = ({ children, className = '' }) => (
  <tr className={className} style={{ borderBottom: '1px solid #e5e7eb' }}>
    {children}
  </tr>
);

const TableHead = ({ children, className = '' }) => (
  <th className={className} style={{
    padding: '0.75rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#374151',
    fontSize: '0.875rem'
  }}>
    {children}
  </th>
);

const TableBody = ({ children }) => <tbody>{children}</tbody>;

const TableCell = ({ children, className = '' }) => (
  <td className={className} style={{
    padding: '0.75rem',
    fontSize: '0.875rem',
    color: '#374151'
  }}>
    {children}
  </td>
);

const Badge = ({ children, color = 'gray' }) => {
  const colors = {
    gray: { bg: '#f3f4f6', text: '#374151' },
    green: { bg: '#dcfce7', text: '#166534' },
    red: { bg: '#fef2f2', text: '#dc2626' },
    blue: { bg: '#dbeafe', text: '#1d4ed8' }
  };
  
  return (
    <span style={{
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      borderRadius: '9999px',
      backgroundColor: colors[color].bg,
      color: colors[color].text
    }}>
      {children}
    </span>
  );
};

export function AutomationHealthDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔄 Iniciando carregamento das métricas...');
    
    fetch('./metrics/agent_activity.log')
      .then(response => {
        console.log('📡 Response status:', response.status);
        if (!response.ok) {
          if (response.status === 404) {
            console.log('📂 Arquivo de métricas não encontrado (404)');
            return "";
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(logText => {
        console.log('📄 Log recebido:', logText.length > 0 ? `${logText.length} caracteres` : 'vazio');
        
        if (!logText.trim()) {
          console.log('⚠️ Log vazio, definindo métricas padrão');
          setMetrics({ 
            summary: { 
              totalInvocations: 0, 
              successfulHeals: 0, 
              failedHeals: 0, 
              successRate: 0 
            }, 
            unstableSelectors: [] 
          });
          setLoading(false);
          return;
        }
        
        const lines = logText.trim().split('\n').filter(line => line.trim());
        console.log('📊 Linhas encontradas:', lines.length);
        
        const allAttempts = lines.map(line => {
          try {
            return JSON.parse(line);
          } catch (e) {
            console.error('❌ Erro ao fazer parse da linha:', line, e);
            return null;
          }
        }).filter(Boolean);
        
        console.log('✅ Tentativas processadas:', allAttempts.length);
        
        const summary = {
          totalInvocations: allAttempts.length,
          successfulHeals: allAttempts.filter(a => a.success).length,
        };
        summary.failedHeals = summary.totalInvocations - summary.successfulHeals;
        summary.successRate = summary.totalInvocations > 0 ? parseFloat(((summary.successfulHeals / summary.totalInvocations) * 100).toFixed(2)) : 0;

        const selectorCounts = allAttempts.reduce((acc, attempt) => {
          const key = attempt.originalSelector;
          if (!acc[key]) {
            acc[key] = { key, original: key, success: 0, failure: 0, total: 0 };
          }
          acc[key].total++;
          if (attempt.success) {
            acc[key].success++;
          } else {
            acc[key].failure++;
          }
          return acc;
        }, {});
        
        const unstableSelectors = Object.values(selectorCounts).sort((a, b) => b.total - a.total);

        console.log('🎯 Métricas processadas:', summary);
        setMetrics({ summary, unstableSelectors });
        setLoading(false);
      })
      .catch(error => {
        console.error("💥 Erro ao carregar métricas:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        color: '#374151',
        fontSize: '1.125rem'
      }}>
        🔄 Carregando métricas do agente...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        color: '#dc2626'
      }}>
        <h1 style={{ color: '#dc2626', marginBottom: '1rem' }}>❌ Erro no Dashboard</h1>
        <p>Erro ao carregar métricas: {error}</p>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
          Verifique o console para mais detalhes.
        </p>
      </div>
    );
  }

  if (!metrics || !metrics.summary || metrics.summary.totalInvocations === 0) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        color: '#6b7280'
      }}>
        <h1 style={{ color: '#1f2937', marginBottom: '1rem' }}>🤖 Dashboard de Saúde da Automação</h1>
        <p>📭 Nenhum dado de atuação do agente encontrado.</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Execute a pipeline de testes para gerar as primeiras métricas.
        </p>
      </div>
    );
  }

  const pieData = [
    { name: 'Sucessos', value: metrics.summary.successfulHeals },
    { name: 'Falhas', value: metrics.summary.failedHeals },
  ];
  const COLORS = ['#16a34a', '#dc2626'];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      padding: '1rem'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: '#1f2937'
          }}>
            🤖 Dashboard de Saúde da Automação
          </h1>
          <p style={{ color: '#6b7280', margin: '0' }}>
            Acompanhe as atuações do agente de auto-correção de testes
          </p>
        </div>
        <div style={{ 
          textAlign: 'right',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          <p style={{ margin: '0' }}>Última atualização: {new Date().toLocaleString('pt-BR')}</p>
          <p style={{ margin: '0' }}>Total de registros: {metrics.summary.totalInvocations}</p>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <Card>
          <CardHeader>
            <CardTitle>🎯 Total de Atuações</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ 
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#3b82f6'
            }}>
              {metrics.summary.totalInvocations}
            </div>
            <p style={{ 
              fontSize: '0.75rem',
              color: '#6b7280',
              margin: '0.25rem 0 0 0'
            }}>
              vezes que o agente foi acionado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>✅ Correções com Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ 
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#16a34a'
            }}>
              {metrics.summary.successfulHeals}
            </div>
            <p style={{ 
              fontSize: '0.75rem',
              color: '#6b7280',
              margin: '0.25rem 0 0 0'
            }}>
              seletores corrigidos automaticamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>❌ Falhas na Correção</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ 
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#dc2626'
            }}>
              {metrics.summary.failedHeals}
            </div>
            <p style={{ 
              fontSize: '0.75rem',
              color: '#6b7280',
              margin: '0.25rem 0 0 0'
            }}>
              requerem análise manual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 Taxa de Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ 
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#8b5cf6'
            }}>
              {metrics.summary.successRate}%
            </div>
            <div style={{
              width: '100%',
              backgroundColor: '#e5e7eb',
              borderRadius: '9999px',
              height: '0.5rem',
              marginTop: '0.5rem'
            }}>
              <div style={{
                backgroundColor: '#8b5cf6',
                height: '0.5rem',
                borderRadius: '9999px',
                width: `${metrics.summary.successRate}%`,
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <Card>
          <CardHeader>
            <CardTitle>📊 Atuações do Agente por Seletor</CardTitle>
            <CardDescription>Os seletores que mais falharam e suas correções.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.unstableSelectors.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="key" angle={-45} textAnchor="end" height={80} interval={0} fontSize={10} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="success" stackId="a" fill="#16a34a" name="Sucessos" />
                <Bar dataKey="failure" stackId="a" fill="#dc2626" name="Falhas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🥧 Distribuição Sucesso vs Falha</CardTitle>
            <CardDescription>Visão geral da eficácia do agente.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={pieData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>🔍 Detalhes dos Seletores Problemáticos</CardTitle>
          <CardDescription>
            Lista completa dos seletores que falharam e suas estatísticas de correção.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seletor Original</TableHead>
                <TableHead style={{ textAlign: 'center' }}>Total</TableHead>
                <TableHead style={{ textAlign: 'center' }}>Sucessos</TableHead>
                <TableHead style={{ textAlign: 'center' }}>Falhas</TableHead>
                <TableHead style={{ textAlign: 'center' }}>Taxa de Sucesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.unstableSelectors.map(selector => {
                const successRate = ((selector.success / selector.total) * 100).toFixed(0);
                return (
                  <TableRow key={selector.key}>
                    <TableCell style={{ 
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      backgroundColor: '#f3f4f6',
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                      maxWidth: '300px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {selector.original}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      {selector.total}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Badge color="green">{selector.success}</Badge>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Badge color="red">{selector.failure}</Badge>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Badge color={successRate >= 75 ? 'green' : successRate >= 50 ? 'blue' : 'red'}>
                        {successRate}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
