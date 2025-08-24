// automation-dashboard/src/AutomationHealthDashboard.jsx

import { useState, useEffect } from 'react';

// Simula a importação de componentes UI (ajuste se necessário para seu projeto)
const Card = ({ children }) => <div style={{ border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>{children}</div>;
const CardHeader = ({ children }) => <div style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{children}</div>;
const CardTitle = ({ children }) => <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{children}</h3>;
const CardDescription = ({ children }) => <p style={{ margin: '0.25rem 0 0', color: '#666', fontSize: '0.875rem' }}>{children}</p>;
const CardContent = ({ children }) => <div style={{ padding: '1rem' }}>{children}</div>;
const Table = ({ children }) => <table style={{ width: '100%', borderCollapse: 'collapse' }}>{children}</table>;
const TableHeader = ({ children }) => <thead style={{ backgroundColor: '#f9fafb' }}>{children}</thead>;
const TableRow = ({ children }) => <tr>{children}</tr>;
const TableHead = ({ children, ...props }) => <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }} {...props}>{children}</th>;
const TableBody = ({ children }) => <tbody>{children}</tbody>;
const TableCell = ({ children, ...props }) => <td style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }} {...props}>{children}</td>;
const Badge = ({ children }) => <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', backgroundColor: '#eee', color: '#333', fontSize: '0.75rem' }}>{children}</span>;
const Progress = ({ value }) => <div style={{ width: '100%', backgroundColor: '#eee', borderRadius: '9999px', height: '8px' }}><div style={{ width: `${value}%`, backgroundColor: '#3b82f6', height: '100%', borderRadius: '9999px' }}></div></div>;


// Supondo que você tem o recharts instalado
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function AutomationHealthDashboard() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // O fetch aponta para o arquivo que está na pasta 'public' do dashboard
        fetch('./dashboard-metrics.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setMetrics(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao carregar métricas do dashboard:", error);
                setMetrics({ summary: { totalInvocations: 0 } }); // Define um estado de erro/vazio
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Carregando métricas...</div>;
    }

    if (!metrics || !metrics.summary || metrics.summary.totalInvocations === 0) {
        return (
            <div className="p-8 text-center text-gray-600">
                <h1 className="text-3xl font-bold mb-4">Saúde da Automação</h1>
                <p>Nenhum dado de atuação do agente encontrado.</p>
                <p className="text-sm mt-2">Execute a pipeline de testes para gerar as primeiras métricas.</p>
            </div>
        )
    }

    const pieData = [
        { name: 'Sucessos', value: metrics.summary.successfulHeals },
        { name: 'Falhas', value: metrics.summary.failedHeals },
    ];
    const COLORS = ['#16a34a', '#dc2626'];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard de Saúde da Automação</h1>
            <p className="text-gray-500 mb-6">Última atualização: {new Date(metrics.lastUpdated).toLocaleString()}</p>

            {/* Métricas Principais */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total de Atuações</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.summary.totalInvocations}</div>
                        <p className="text-xs text-muted-foreground">vezes que o agente foi acionado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Correções com Sucesso</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{metrics.summary.successfulHeals}</div>
                        <p className="text-xs text-muted-foreground">seletores corrigidos automaticamente</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Falhas na Correção</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{metrics.summary.failedHeals}</div>
                        <p className="text-xs text-muted-foreground">requerem análise manual</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.summary.successRate}%</div>
                        <Progress value={metrics.summary.successRate} className="mt-2" />
                    </CardContent>
                </Card>
            </div>

            {/* Gráficos */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-6">
                <Card className="col-span-1 lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Atuações do Agente por Seletor</CardTitle>
                        <CardDescription>Os 10 seletores que mais falham.</CardDescription>
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
                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Distribuição de Sucesso vs. Falha</CardTitle>
                        <CardDescription>Visão geral da eficácia do agente.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
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

            {/* Tabela de Detalhes */}
            <Card>
                <CardHeader>
                    <CardTitle>Detalhes dos Seletores Instáveis</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Seletor Original</TableHead>
                                <TableHead className="text-center">Total de Falhas</TableHead>
                                <TableHead className="text-center">Taxa de Sucesso</TableHead>
                                <TableHead>Última Correção Sugerida</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {metrics.unstableSelectors.map(selector => (
                                <TableRow key={selector.key}>
                                    <TableCell className="font-mono text-xs">{selector.original}</TableCell>
                                    <TableCell className="text-center font-bold">{selector.total}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge>{((selector.success / selector.total) * 100).toFixed(0)}%</Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {selector.history.slice(-1)[0]?.correctedTo || 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}