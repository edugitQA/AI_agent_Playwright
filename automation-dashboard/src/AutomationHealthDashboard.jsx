// sample-react-app/src/components/AutomationHealthDashboard.jsx

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function AutomationHealthDashboard({ onBackToDashboard }) {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/dashboard-metrics.json')
            .then(response => response.json())
            .then(data => {
                setMetrics(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao carregar métricas do dashboard:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="p-8">Carregando métricas...</div>;
    }

    if (!metrics || metrics.summary.totalInvocations === 0) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-4">Saúde da Automação</h1>
                <p>Nenhum dado de atuação do agente encontrado. Execute os testes para gerar as métricas.</p>
            </div>
        )
    }

    const pieData = [
        { name: 'Sucessos', value: metrics.summary.successfulHeals },
        { name: 'Falhas', value: metrics.summary.failedHeals },
    ];
    const COLORS = ['#16a34a', '#dc2626'];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard de Saúde da Automação</h1>
            <p className="text-gray-500 mb-6">Última atualização: {new Date(metrics.lastUpdated).toLocaleString()}</p>

            {/* Métricas Principais */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Atuações</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.summary.totalInvocations}</div>
                        <p className="text-xs text-muted-foreground">vezes que o agente foi acionado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Correções com Sucesso</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.summary.successfulHeals}</div>
                         <p className="text-xs text-muted-foreground">seletores corrigidos automaticamente</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Falhas na Correção</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.summary.failedHeals}</div>
                         <p className="text-xs text-muted-foreground">requerem análise manual</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.summary.successRate}%</div>
                        <Progress value={metrics.summary.successRate} className="mt-2" />
                    </CardContent>
                </Card>
            </div>

            {/* Gráficos */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-6">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Atuações do Agente por Seletor</CardTitle>
                        <CardDescription>Os 10 seletores que mais falham.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={metrics.unstableSelectors.slice(0, 10)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="key" angle={-45} textAnchor="end" height={80} interval={0} fontSize={10} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="success" stackId="a" fill="#16a34a" name="Sucessos" />
                                <Bar dataKey="failure" stackId="a" fill="#dc2626" name="Falhas" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
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
                                        <Badge variant={selector.success / selector.total > 0.7 ? "default" : "destructive"}>
                                            {((selector.success / selector.total) * 100).toFixed(0)}%
                                        </Badge>
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