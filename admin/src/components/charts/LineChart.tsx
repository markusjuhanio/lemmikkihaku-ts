import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FormControl, InputLabel, MenuItem, Paper, Select, Theme, Typography, useTheme, Grid, Box, Divider } from '@mui/material';
import { AdminViewListing, AdminViewUser, Message } from '../../types';
import moment from 'moment';
import 'moment/locale/fi';
moment.locale('fi');

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

enum DataPer {
  Year = 'year',
  Month = 'month',
  Week = 'week',
  Day = 'day',
  Hour = 'hour'
}

enum TimeRange {
  One = 1,
  Three = 3,
  Six = 6,
  Twelve = 12,
}

interface LineChartProps {
  title: string,
  backgroundColor: string,
  borderColor: string,
  data: AdminViewUser[] | AdminViewListing[] | Message[]
}

const LineChart = (props: LineChartProps) => {
  const { title, backgroundColor, borderColor, data } = props;

  const [chartData, setChartData] = useState<number[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);

  const [dataPer, setDataPer] = useState<DataPer>(DataPer.Week);
  const [dataRange, setDataRange] = useState<TimeRange>(TimeRange.Three);

  const theme: Theme = useTheme();

  useEffect(() => {
    const dataObj = getData(dataRange, dataPer);
    setChartLabels(dataObj.labels);
    setChartData(dataObj.data);
  }, [data, dataPer, dataRange]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme.palette.text.secondary,
        },
        display: true,
      },
      title: {
        display: false,
        text: `${title} · ${props.data.length}`,
        color: theme.palette.text.secondary,
      },
    },
    scales: {
      yAxes: {
        ticks: {
          color: theme.palette.text.primary,
          fontSize: 12,
        },
        beginAtZero: true
      },
      xAxes: {
        ticks: {
          color: theme.palette.text.primary,
          fontSize: 12,
        },
      },
    },
    scale: {
      ticks: {
        precision: 0
      }
    }
  };

  const handleDataPerChange = (value: DataPer): void => {
    setDataPer(value);
  };

  const handleDataRangeChange = (value: TimeRange): void => {
    setDataRange(value);
  };

  const getData = (range: number, per: DataPer): { data: number[], labels: string[] } => {
    const map = new Map<string, number>();
    const olderThan: Date = moment(new Date()).subtract(range, per).startOf('day').toDate();

    for (const obj of props.data) {
      if (moment(obj.createdAt).isAfter(olderThan)) {
        const label: string = formatDate(per, obj.createdAt);
        const value: number = map.get(label) || 0;
        map.set(label, (value + 1));
      }
    }

    const data: number[] = Array.from(map.values()).reverse();
    const labels: string[] = Array.from(map.keys()).reverse();

    return {
      data,
      labels
    };
  };

  const formatDate = (type: DataPer, date: Date): string => {
    switch (type) {
    case DataPer.Year:
      return moment(date).format('YYYY');
    case DataPer.Month:
      return moment(date).format('MMMM YYYY');
    case DataPer.Week:
      return moment(date).format('DD.MM');
    case DataPer.Day:
      return moment(date).format('DD.MM');
    case DataPer.Hour:
      return moment(date).format('HH:mm');
    default:
      return moment(date).format('MMMM YYYY');
    }
  };

  const finalData = {
    labels: chartLabels,
    datasets: [
      {
        label: title,
        data: chartData,
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        lineTension: 0.25
      },
    ],
  };

  return (
    <Paper>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ p: 2, mb: -3 }}>
          <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {`${title} · ${props.data.length}`}
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Line options={options} data={finalData} />
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <FormControl size='small' fullWidth>
                <InputLabel>Aika</InputLabel>
                <Select
                  onChange={(e) => handleDataRangeChange(e.target.value as TimeRange)}
                  size='small'
                  label="Aikaväli"
                  value={dataRange}
                >
                  <MenuItem value={TimeRange.One}>1</MenuItem>
                  <MenuItem value={TimeRange.Three}>3</MenuItem>
                  <MenuItem value={TimeRange.Six}>6</MenuItem>
                  <MenuItem value={TimeRange.Twelve}>12</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <FormControl size='small' fullWidth>
                <InputLabel>Yksikkö</InputLabel>
                <Select
                  onChange={(e) => handleDataPerChange(e.target.value as DataPer)}
                  size='small'
                  label="Yksikkö"
                  value={dataPer}
                >
                  <MenuItem value={DataPer.Hour}>tuntia</MenuItem>
                  <MenuItem value={DataPer.Day}>päivää</MenuItem>
                  <MenuItem value={DataPer.Week}>viikkoa</MenuItem>
                  <MenuItem value={DataPer.Month}>kuukautta</MenuItem>
                  <MenuItem value={DataPer.Year}>vuotta</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default LineChart;