// automation-dashboard/src/AutomationHealthDashboard.jsx

import { useState, useEffect } from 'react';
// ... (mantenha os imports de UI e recharts como estavam)
// Supondo que você tem o recharts instalado
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


const Card = ({ children }) => <div className="bg-white shadow-sm rounded-lg">{children}</div>;
const CardHeader = ({ children }) => <div className="p-4 border-b">{children}</div>;
const CardTitle = ({ children }) => <h3 className="text-lg font-semibold">{children}</h3>;
const CardDescription = ({ children }) => <p className="text-sm text-gray-500">{children}</p>;
const CardContent = ({ children }) => <div className="p-4">{children}</div>;
const Table = ({ children }) => <table className="w-full text-sm">{children}</table>;
const TableHeader = ({ children }) => <thead className="bg-gray-50">{children}</thead>;
const TableRow = ({ children }) => <tr className="border-b">{children}</tr>;
const TableHead = ({ children, ...props }) => <th className="px-4 py-2 text-left font-medium" {...props}>{children}</th>;
const TableBody = ({ children }) => <tbody>{children}</tbody>;
const TableCell = ({ children, ...props }) => <td className="px-4 py-2" {...props}>{children}</td>;
const Badge = ({ children }) => <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{children}</span>;
const Progress = ({ value }) => <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div></div>;


export function AutomationHealthDashboard() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Iniciando carregamento das métricas...');
        
        fetch('./metrics/agent_activity.log')
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    // Se o arquivo não existir (404), trata como sem dados
                    if (response.status === 404) {
                        console.log('Arquivo de métricas não encontrado (404)');
                        return "";
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(logText => {
                console.log('Log text recebido:', logText.length > 0 ? `${logText.length} caracteres` : 'vazio');
                
                if (!logText.trim()) {
                    console.log('Log vazio, definindo métricas padrão');
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
                
                // Processa o log de atividades aqui no cliente
                const lines = logText.trim().split('\n').filter(line => line.trim());
                console.log('Linhas encontradas:', lines.length);
                
                const allAttempts = lines.map(line => {
                    try {
                        return JSON.parse(line);
                    } catch (e) {
                        console.error('Erro ao fazer parse da linha:', line, e);
                        return null;
                    }
                }).filter(Boolean);
                
                console.log('Tentativas processadas:', allAttempts.length);
                
                const summary = {
                    totalInvocations: allAttempts.length,
                    successfulHeals: allAttempts.filter(a => a.success).length,
                };
                summary.failedHeals = summary.totalInvocations - summary.successfulHeals;
                summary.successRate = summary.totalInvocations > 0 ? parseFloat(((summary.successfulHeals / summary.totalInvocations) * 100).toFixed(2)) : 0;

                const selectorCounts = allAttempts.reduce((acc, attempt) => {
                    const key = attempt.originalSelector;
                    if (!acc[key]) {
                        acc[key] = { key, original: key, success: 0, failure: 0, total: 0, history: [] };
                    }
                    acc[key].total++;
                    if (attempt.success) {
                        acc[key].success++;
                        acc[key].history.push({ correctedTo: attempt.successfulSelector, date: attempt.timestamp });
                    } else {
                        acc[key].failure++;
                    }
                    return acc;
                }, {});
                
                const unstableSelectors = Object.values(selectorCounts).sort((a, b) => b.total - a.total);

                console.log('Métricas processadas:', summary);
                setMetrics({ summary, unstableSelectors });
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao carregar ou processar o log de atividades:", error);
                setError(error.message);
                setLoading(false);
            });
    }, []);
    
    if (loading) {
        return <div className="p-8 text-center">Carregando métricas...</div>;
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-600">
                <h1 className="text-3xl font-bold mb-4">Erro no Dashboard</h1>
                <p>Erro ao carregar métricas: {error}</p>
                <p className="text-sm mt-2 text-gray-600">Verifique o console para mais detalhes.</p>
            </div>
        );
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
            {/* Opcional: Adicionar um timestamp de quando o dashboard foi carregado */}
            <p className="text-gray-500 mb-6">Dados processados em: {new Date().toLocaleString()}</p>
            
            {/* O resto do JSX é o mesmo */}
             {/* Métricas Principais */}
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total de Atuações</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.summary.totalInvocations}</div>
                        <p className="text-xs text-gray-500">vezes que o agente foi acionado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Correções com Sucesso</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{metrics.summary.successfulHeals}</div>
                        <p className="text-xs text-gray-500">seletores corrigidos automaticamente</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Falhas na Correção</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{metrics.summary.failedHeals}</div>
                        <p className="text-xs text-gray-500">requerem análise manual</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Taxa de Sucesso</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.summary.successRate}%</div>
                        <Progress value={metrics.summary.successRate} />
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