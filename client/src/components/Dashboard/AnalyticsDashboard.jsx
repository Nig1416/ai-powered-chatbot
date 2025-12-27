import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const AnalyticsDashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/analytics');
                setData(res.data);
            } catch (err) {
                console.error("Error fetching analytics", err);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000); // Refresh every 5s
        return () => clearInterval(interval);
    }, []);

    if (!data) return <div style={{ padding: '2rem' }}>Loading Analytics...</div>;

    return (
        <div className="dashboard-container">
            <h1 style={{ marginBottom: '2rem' }}>Analytics Overview</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Conversations</div>
                    <div className="stat-value">{data.totalConversations}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Messages</div>
                    <div className="stat-value">{data.totalMessages}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Avg Msg/Conv</div>
                    <div className="stat-value">{data.avgMessages}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="stat-card">
                    <h3>Sentiment Analysis</h3>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                        <Doughnut
                            data={{
                                labels: ['Positive', 'Neutral', 'Negative'],
                                datasets: [{
                                    data: [data.sentiment.positive, data.sentiment.neutral, data.sentiment.negative],
                                    backgroundColor: ['#2dd4bf', '#6366f1', '#f43f5e'],
                                    borderWidth: 0
                                }]
                            }}
                            options={{
                                plugins: {
                                    legend: { position: 'bottom', labels: { color: 'white' } }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Mock Activity Chart - In real app, fetch historical data */}
                <div className="stat-card">
                    <h3>Activity Trend (Mock)</h3>
                    <div style={{ height: '300px' }}>
                        <Line
                            data={{
                                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                datasets: [{
                                    label: 'Messages',
                                    data: [12, 19, 3, 5, 2, 3, 10],
                                    borderColor: '#a855f7',
                                    tension: 0.4
                                }]
                            }}
                            options={{
                                scales: {
                                    y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#94a3b8' } },
                                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                                },
                                plugins: { legend: { display: false } }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
