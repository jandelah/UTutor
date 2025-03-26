import { useEffect, useState } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar los componentes de ChartJS
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const SubjectDistribution = ({ data = [] }) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  
  useEffect(() => {
    if (data.length > 0) {
      // Colores para el gráfico
      const colors = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.error.main,
        theme.palette.warning.main,
        theme.palette.info.main,
        theme.palette.success.main
      ];
      
      setChartData({
        labels: data.map(item => item.subject),
        datasets: [
          {
            data: data.map(item => item.count),
            backgroundColor: data.map((_, index) => colors[index % colors.length]),
            borderColor: data.map((_, index) => colors[index % colors.length]),
            borderWidth: 1,
          },
        ],
      });
    }
  }, [data, theme]);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Distribución por Materia
      </Typography>
      <Box sx={{ height: 260, mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pie data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default SubjectDistribution;