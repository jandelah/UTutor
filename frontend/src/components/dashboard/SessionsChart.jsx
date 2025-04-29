import { useEffect, useState } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Registrar los componentes de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SessionsChart = ({ data = [] }) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  
  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setChartData({
        labels: data.map(item => item.month || ''),
        datasets: [
          {
            label: 'Sesiones Mensuales',
            data: data.map(item => item.sessions || 0),
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light,
            tension: 0.3,
            fill: true
          }
        ]
      });
    } else {
      // Default empty chart
      setChartData({
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Sesiones Mensuales',
            data: [0, 0, 0, 0, 0, 0],
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light,
            tension: 0.3,
            fill: true
          }
        ]
      });
    }
  }, [data, theme]);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };
  
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Actividad Mensual
      </Typography>
      <Box sx={{ height: 300, mt: 2 }}>
        <Line data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default SessionsChart;