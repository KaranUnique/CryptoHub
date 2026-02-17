/**
 * Advanced Chart Utilities for CryptoHub
 * Comprehensive utilities for chart configuration, theming,
 * data processing, annotations, and visualization.
 * 
 * Author: ayushap18
 * Date: January 2026
 * ECWoC 2026 Contribution
 */

// ============================================================
// CHART COLOR THEMES
// ============================================================

/**
 * Chart color themes
 */
export const ChartThemes = {
  dark: {
    background: '#1a1a2e',
    gridColor: 'rgba(255, 255, 255, 0.1)',
    textColor: '#e0e0e0',
    upColor: '#00c853',
    downColor: '#ff1744',
    volumeUp: 'rgba(0, 200, 83, 0.3)',
    volumeDown: 'rgba(255, 23, 68, 0.3)',
    crosshair: '#888',
    tooltipBg: 'rgba(0, 0, 0, 0.85)',
    tooltipBorder: '#444',
    lineColors: ['#3498db', '#9b59b6', '#e67e22', '#1abc9c', '#e74c3c', '#f39c12'],
    areaGradient: ['rgba(52, 152, 219, 0.4)', 'rgba(52, 152, 219, 0.0)']
  },
  light: {
    background: '#ffffff',
    gridColor: 'rgba(0, 0, 0, 0.1)',
    textColor: '#333333',
    upColor: '#26a69a',
    downColor: '#ef5350',
    volumeUp: 'rgba(38, 166, 154, 0.3)',
    volumeDown: 'rgba(239, 83, 80, 0.3)',
    crosshair: '#666',
    tooltipBg: 'rgba(255, 255, 255, 0.95)',
    tooltipBorder: '#ddd',
    lineColors: ['#2980b9', '#8e44ad', '#d35400', '#16a085', '#c0392b', '#f1c40f'],
    areaGradient: ['rgba(41, 128, 185, 0.4)', 'rgba(41, 128, 185, 0.0)']
  },
  midnight: {
    background: '#0f0f23',
    gridColor: 'rgba(100, 100, 150, 0.15)',
    textColor: '#a0a0c0',
    upColor: '#00ff88',
    downColor: '#ff4466',
    volumeUp: 'rgba(0, 255, 136, 0.2)',
    volumeDown: 'rgba(255, 68, 102, 0.2)',
    crosshair: '#6666aa',
    tooltipBg: 'rgba(15, 15, 35, 0.95)',
    tooltipBorder: '#333366',
    lineColors: ['#4dabf5', '#ba68c8', '#ffb74d', '#4dd0e1', '#f06292', '#aed581'],
    areaGradient: ['rgba(77, 171, 245, 0.3)', 'rgba(77, 171, 245, 0.0)']
  },
  neon: {
    background: '#0a0a0a',
    gridColor: 'rgba(0, 255, 255, 0.1)',
    textColor: '#00ffff',
    upColor: '#00ff00',
    downColor: '#ff00ff',
    volumeUp: 'rgba(0, 255, 0, 0.2)',
    volumeDown: 'rgba(255, 0, 255, 0.2)',
    crosshair: '#00ffff',
    tooltipBg: 'rgba(0, 0, 0, 0.9)',
    tooltipBorder: '#00ffff',
    lineColors: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff6600', '#6600ff'],
    areaGradient: ['rgba(0, 255, 255, 0.3)', 'rgba(0, 255, 255, 0.0)']
  }
};

/**
 * Gets theme configuration
 * @param {string} themeName - Theme name
 * @returns {Object} Theme configuration
 */
export const getChartTheme = (themeName = 'dark') => {
  return ChartThemes[themeName] || ChartThemes.dark;
};

// ============================================================
// CHART CONFIGURATION BUILDERS
// ============================================================

/**
 * Creates base chart configuration
 * @param {Object} options - Chart options
 * @returns {Object} Chart.js configuration
 */
export const createBaseChartConfig = (options = {}) => {
  const {
    theme = 'dark',
    responsive = true,
    maintainAspectRatio = false,
    animation = true
  } = options;

  const colors = getChartTheme(theme);

  return {
    responsive,
    maintainAspectRatio,
    animation: animation ? {
      duration: 750,
      easing: 'easeOutQuart'
    } : false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: colors.textColor,
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: colors.tooltipBg,
        borderColor: colors.tooltipBorder,
        borderWidth: 1,
        titleColor: colors.textColor,
        bodyColor: colors.textColor,
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      x: {
        grid: {
          color: colors.gridColor,
          drawBorder: false
        },
        ticks: {
          color: colors.textColor
        }
      },
      y: {
        grid: {
          color: colors.gridColor,
          drawBorder: false
        },
        ticks: {
          color: colors.textColor
        }
      }
    }
  };
};

/**
 * Creates line chart configuration
 * @param {Array} data - Chart data
 * @param {Object} options - Chart options
 * @returns {Object} Line chart configuration
 */
export const createLineChartConfig = (data, options = {}) => {
  const {
    labels = [],
    datasets = [],
    theme = 'dark',
    fill = false,
    tension = 0.4,
    showPoints = false
  } = options;

  const colors = getChartTheme(theme);
  const baseConfig = createBaseChartConfig({ theme, ...options });

  const processedDatasets = datasets.map((dataset, index) => ({
    label: dataset.label || `Series ${index + 1}`,
    data: dataset.data,
    borderColor: dataset.color || colors.lineColors[index % colors.lineColors.length],
    backgroundColor: fill 
      ? `${dataset.color || colors.lineColors[index % colors.lineColors.length]}40` 
      : 'transparent',
    borderWidth: dataset.borderWidth || 2,
    fill,
    tension,
    pointRadius: showPoints ? 3 : 0,
    pointHoverRadius: 5,
    pointBackgroundColor: dataset.color || colors.lineColors[index % colors.lineColors.length],
    ...dataset
  }));

  return {
    type: 'line',
    data: {
      labels,
      datasets: processedDatasets
    },
    options: baseConfig
  };
};

/**
 * Creates area chart configuration
 * @param {Array} data - Chart data
 * @param {Object} options - Chart options
 * @returns {Object} Area chart configuration
 */
export const createAreaChartConfig = (data, options = {}) => {
  const { theme = 'dark' } = options;
  const colors = getChartTheme(theme);

  return createLineChartConfig(data, {
    ...options,
    fill: true,
    datasets: options.datasets?.map((dataset) => ({
      ...dataset,
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        
        if (!chartArea) return 'transparent';
        
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, colors.areaGradient[0]);
        gradient.addColorStop(1, colors.areaGradient[1]);
        return gradient;
      }
    }))
  });
};

/**
 * Creates candlestick chart configuration
 * @param {Array} candles - OHLCV data
 * @param {Object} options - Chart options
 * @returns {Object} Candlestick configuration
 */
export const createCandlestickConfig = (candles, options = {}) => {
  const {
    theme = 'dark',
    showVolume = true
  } = options;

  const colors = getChartTheme(theme);

  // Process candlestick data
  const candleData = candles.map(candle => ({
    x: candle.timestamp || candle.time,
    o: candle.open,
    h: candle.high,
    l: candle.low,
    c: candle.close
  }));

  // Process volume data
  const volumeData = showVolume ? candles.map(candle => ({
    x: candle.timestamp || candle.time,
    y: candle.volume,
    backgroundColor: candle.close >= candle.open 
      ? colors.volumeUp 
      : colors.volumeDown
  })) : [];

  return {
    type: 'candlestick',
    data: {
      datasets: [
        {
          label: 'Price',
          data: candleData,
          color: {
            up: colors.upColor,
            down: colors.downColor,
            unchanged: colors.textColor
          },
          borderColor: {
            up: colors.upColor,
            down: colors.downColor,
            unchanged: colors.textColor
          }
        },
        ...(showVolume ? [{
          label: 'Volume',
          type: 'bar',
          data: volumeData,
          yAxisID: 'volume',
          barPercentage: 0.8
        }] : [])
      ]
    },
    options: {
      ...createBaseChartConfig({ theme, ...options }),
      scales: {
        x: {
          type: 'time',
          time: {
            unit: options.timeUnit || 'day'
          },
          grid: {
            color: colors.gridColor
          },
          ticks: {
            color: colors.textColor
          }
        },
        y: {
          position: 'right',
          grid: {
            color: colors.gridColor
          },
          ticks: {
            color: colors.textColor
          }
        },
        ...(showVolume ? {
          volume: {
            position: 'left',
            max: Math.max(...candles.map(c => c.volume)) * 4,
            grid: {
              display: false
            },
            ticks: {
              display: false
            }
          }
        } : {})
      }
    }
  };
};

/**
 * Creates bar chart configuration
 * @param {Array} data - Chart data
 * @param {Object} options - Chart options
 * @returns {Object} Bar chart configuration
 */
export const createBarChartConfig = (data, options = {}) => {
  const {
    labels = [],
    datasets = [],
    theme = 'dark',
    horizontal = false,
    stacked = false
  } = options;

  const colors = getChartTheme(theme);
  const baseConfig = createBaseChartConfig({ theme, ...options });

  const processedDatasets = datasets.map((dataset, index) => ({
    label: dataset.label || `Series ${index + 1}`,
    data: dataset.data,
    backgroundColor: dataset.color || colors.lineColors[index % colors.lineColors.length],
    borderColor: dataset.borderColor || 'transparent',
    borderWidth: 0,
    borderRadius: 4,
    ...dataset
  }));

  return {
    type: 'bar',
    data: {
      labels,
      datasets: processedDatasets
    },
    options: {
      ...baseConfig,
      indexAxis: horizontal ? 'y' : 'x',
      scales: {
        ...baseConfig.scales,
        x: {
          ...baseConfig.scales.x,
          stacked
        },
        y: {
          ...baseConfig.scales.y,
          stacked
        }
      }
    }
  };
};

/**
 * Creates pie/doughnut chart configuration
 * @param {Array} data - Chart data
 * @param {Object} options - Chart options
 * @returns {Object} Pie chart configuration
 */
export const createPieChartConfig = (data, options = {}) => {
  const {
    labels = [],
    values = [],
    theme = 'dark',
    type = 'pie', // 'pie' or 'doughnut'
    cutout = type === 'doughnut' ? '60%' : 0
  } = options;

  const colors = getChartTheme(theme);

  return {
    type,
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: options.colors || colors.lineColors.slice(0, values.length),
        borderWidth: 2,
        borderColor: colors.background,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout,
      plugins: {
        legend: {
          display: true,
          position: 'right',
          labels: {
            color: colors.textColor,
            usePointStyle: true,
            padding: 15
          }
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          borderColor: colors.tooltipBorder,
          borderWidth: 1,
          titleColor: colors.textColor,
          bodyColor: colors.textColor,
          callbacks: {
            label: (context) => {
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  };
};

/**
 * Creates radar chart configuration
 * @param {Array} data - Chart data
 * @param {Object} options - Chart options
 * @returns {Object} Radar chart configuration
 */
export const createRadarChartConfig = (data, options = {}) => {
  const {
    labels = [],
    datasets = [],
    theme = 'dark'
  } = options;

  const colors = getChartTheme(theme);

  const processedDatasets = datasets.map((dataset, index) => ({
    label: dataset.label || `Series ${index + 1}`,
    data: dataset.data,
    borderColor: dataset.color || colors.lineColors[index % colors.lineColors.length],
    backgroundColor: `${dataset.color || colors.lineColors[index % colors.lineColors.length]}40`,
    borderWidth: 2,
    pointBackgroundColor: dataset.color || colors.lineColors[index % colors.lineColors.length],
    pointRadius: 3,
    ...dataset
  }));

  return {
    type: 'radar',
    data: {
      labels,
      datasets: processedDatasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: {
            color: colors.gridColor
          },
          grid: {
            color: colors.gridColor
          },
          pointLabels: {
            color: colors.textColor
          },
          ticks: {
            color: colors.textColor,
            backdropColor: 'transparent'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: colors.textColor,
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          borderColor: colors.tooltipBorder,
          borderWidth: 1,
          titleColor: colors.textColor,
          bodyColor: colors.textColor
        }
      }
    }
  };
};

// ============================================================
// CHART ANNOTATIONS
// ============================================================

/**
 * Creates horizontal line annotation
 * @param {number} value - Y-axis value
 * @param {Object} options - Annotation options
 * @returns {Object} Annotation configuration
 */
export const createHorizontalLine = (value, options = {}) => {
  const {
    color = '#ff6b6b',
    label = '',
    dashed = false,
    width = 2
  } = options;

  return {
    type: 'line',
    yMin: value,
    yMax: value,
    borderColor: color,
    borderWidth: width,
    borderDash: dashed ? [5, 5] : [],
    label: label ? {
      display: true,
      content: label,
      position: 'end',
      backgroundColor: color,
      color: '#fff',
      padding: 4
    } : undefined
  };
};

/**
 * Creates vertical line annotation
 * @param {number|string} value - X-axis value
 * @param {Object} options - Annotation options
 * @returns {Object} Annotation configuration
 */
export const createVerticalLine = (value, options = {}) => {
  const {
    color = '#4ecdc4',
    label = '',
    dashed = false,
    width = 2
  } = options;

  return {
    type: 'line',
    xMin: value,
    xMax: value,
    borderColor: color,
    borderWidth: width,
    borderDash: dashed ? [5, 5] : [],
    label: label ? {
      display: true,
      content: label,
      position: 'start',
      rotation: -90,
      backgroundColor: color,
      color: '#fff',
      padding: 4
    } : undefined
  };
};

/**
 * Creates box annotation
 * @param {Object} bounds - Box bounds {xMin, xMax, yMin, yMax}
 * @param {Object} options - Annotation options
 * @returns {Object} Annotation configuration
 */
export const createBoxAnnotation = (bounds, options = {}) => {
  const {
    backgroundColor = 'rgba(255, 99, 132, 0.2)',
    borderColor = 'rgba(255, 99, 132, 1)',
    borderWidth = 1,
    label = ''
  } = options;

  return {
    type: 'box',
    ...bounds,
    backgroundColor,
    borderColor,
    borderWidth,
    label: label ? {
      display: true,
      content: label,
      position: 'center',
      color: borderColor
    } : undefined
  };
};

/**
 * Creates support/resistance level annotations
 * @param {Array} levels - Array of {price, type} objects
 * @param {Object} options - Annotation options
 * @returns {Object} Annotations configuration
 */
export const createSupportResistanceAnnotations = (levels, options = {}) => {
  const {
    supportColor = '#26a69a',
    resistanceColor = '#ef5350',
    showLabels = true
  } = options;

  const annotations = {};

  levels.forEach((level, index) => {
    const color = level.type === 'support' ? supportColor : resistanceColor;
    const label = level.type === 'support' ? 'S' : 'R';

    annotations[`level_${index}`] = createHorizontalLine(level.price, {
      color,
      label: showLabels ? `${label}: $${level.price.toFixed(2)}` : '',
      dashed: true
    });
  });

  return annotations;
};

// ============================================================
// CHART DATA TRANSFORMERS
// ============================================================

/**
 * Transforms API data to chart format
 * @param {Array} data - API data
 * @param {Object} options - Transform options
 * @returns {Object} Chart-ready data
 */
export const transformToChartData = (data, options = {}) => {
  const {
    xKey = 'timestamp',
    yKey = 'price',
    format = 'line' // 'line', 'ohlc', 'bar'
  } = options;

  if (format === 'ohlc') {
    return data.map(item => ({
      x: new Date(item[xKey] || item.time || item.timestamp),
      o: item.open,
      h: item.high,
      l: item.low,
      c: item.close
    }));
  }

  const labels = data.map(item => {
    const value = item[xKey];
    return value instanceof Date ? value : new Date(value);
  });

  const values = data.map(item => item[yKey]);

  return { labels, values };
};

/**
 * Samples data for large datasets
 * @param {Array} data - Source data
 * @param {number} maxPoints - Maximum number of points
 * @returns {Array} Sampled data
 */
export const sampleChartData = (data, maxPoints = 500) => {
  if (!data || data.length <= maxPoints) return data;

  const step = Math.ceil(data.length / maxPoints);
  const sampled = [];

  for (let i = 0; i < data.length; i += step) {
    sampled.push(data[i]);
  }

  // Always include the last point
  if (sampled[sampled.length - 1] !== data[data.length - 1]) {
    sampled.push(data[data.length - 1]);
  }

  return sampled;
};

/**
 * Fills gaps in time series data
 * @param {Array} data - Time series data
 * @param {number} intervalMs - Expected interval in milliseconds
 * @returns {Array} Data with gaps filled
 */
export const fillDataGaps = (data, intervalMs) => {
  if (!data || data.length < 2) return data;

  const filled = [];
  const timeKey = data[0].timestamp ? 'timestamp' : data[0].time ? 'time' : 'x';

  for (let i = 0; i < data.length; i++) {
    filled.push(data[i]);

    if (i < data.length - 1) {
      const currentTime = new Date(data[i][timeKey]).getTime();
      const nextTime = new Date(data[i + 1][timeKey]).getTime();
      const gap = nextTime - currentTime;

      // Fill gaps with interpolated values
      if (gap > intervalMs * 1.5) {
        const numMissing = Math.floor(gap / intervalMs) - 1;
        const currentValue = data[i].close || data[i].price || data[i].y;
        const nextValue = data[i + 1].close || data[i + 1].price || data[i + 1].y;

        for (let j = 1; j <= numMissing; j++) {
          const ratio = j / (numMissing + 1);
          const interpolatedValue = currentValue + (nextValue - currentValue) * ratio;
          const interpolatedTime = new Date(currentTime + intervalMs * j);

          filled.push({
            [timeKey]: interpolatedTime,
            price: interpolatedValue,
            close: interpolatedValue,
            y: interpolatedValue,
            interpolated: true
          });
        }
      }
    }
  }

  return filled;
};

/**
 * Normalizes data to percentage scale
 * @param {Array} datasets - Array of datasets
 * @returns {Array} Normalized datasets
 */
export const normalizeToPercentage = (datasets) => {
  return datasets.map(dataset => {
    const firstValue = dataset.data[0];
    if (!firstValue || firstValue === 0) return dataset;

    return {
      ...dataset,
      data: dataset.data.map(value => ((value - firstValue) / firstValue) * 100)
    };
  });
};

// ============================================================
// CHART TOOLTIP FORMATTERS
// ============================================================

/**
 * Creates crypto price tooltip formatter
 * @param {Object} options - Formatter options
 * @returns {Function} Tooltip callback
 */
export const createPriceTooltipFormatter = (options = {}) => {
  const { currency = 'USD', showChange = true } = options;

  return {
    title: (items) => {
      const item = items[0];
      const date = new Date(item.parsed.x || item.label);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    label: (item) => {
      const value = item.parsed.y;
      let label = `${item.dataset.label}: ${formatCurrency(value, currency)}`;

      if (showChange && item.dataIndex > 0) {
        const prevValue = item.dataset.data[item.dataIndex - 1];
        const change = ((value - prevValue) / prevValue) * 100;
        const changeStr = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
        label += ` (${changeStr})`;
      }

      return label;
    }
  };
};

/**
 * Creates OHLC tooltip formatter
 * @param {Object} options - Formatter options
 * @returns {Function} Tooltip callback
 */
export const createOHLCTooltipFormatter = (options = {}) => {
  const { currency = 'USD' } = options;

  return {
    title: (items) => {
      const date = new Date(items[0].parsed.x);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    },
    label: (item) => {
      const data = item.raw;
      if (data.o !== undefined) {
        return [
          `Open: ${formatCurrency(data.o, currency)}`,
          `High: ${formatCurrency(data.h, currency)}`,
          `Low: ${formatCurrency(data.l, currency)}`,
          `Close: ${formatCurrency(data.c, currency)}`,
          data.v !== undefined ? `Volume: ${formatVolume(data.v)}` : ''
        ].filter(Boolean);
      }
      return `${item.dataset.label}: ${formatCurrency(item.parsed.y, currency)}`;
    }
  };
};

// ============================================================
// CHART UPDATE UTILITIES
// ============================================================

/**
 * Smoothly updates chart data
 * @param {Object} chart - Chart.js instance
 * @param {Array} newData - New data
 * @param {Object} options - Update options
 */
export const updateChartData = (chart, newData, options = {}) => {
  const {
    animate = true,
    shift = false,
    maxPoints = null
  } = options;

  if (!chart || !newData) return;

  const dataset = chart.data.datasets[0];

  if (Array.isArray(newData)) {
    // Replace entire dataset
    dataset.data = newData;
    chart.data.labels = newData.map(d => d.x || d.timestamp || d.time);
  } else {
    // Add single point
    dataset.data.push(newData);
    chart.data.labels.push(newData.x || newData.timestamp || newData.time);

    if (shift || (maxPoints && dataset.data.length > maxPoints)) {
      dataset.data.shift();
      chart.data.labels.shift();
    }
  }

  chart.update(animate ? 'default' : 'none');
};

/**
 * Adds real-time data point to chart
 * @param {Object} chart - Chart.js instance
 * @param {Object} point - New data point
 * @param {number} maxPoints - Maximum points to keep
 */
export const addRealtimePoint = (chart, point, maxPoints = 100) => {
  if (!chart || !point) return;

  const dataset = chart.data.datasets[0];
  const label = point.x || point.timestamp || new Date();

  dataset.data.push(point.y || point.price || point.close);
  chart.data.labels.push(label);

  if (dataset.data.length > maxPoints) {
    dataset.data.shift();
    chart.data.labels.shift();
  }

  chart.update('none');
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Formats currency value
 * @param {number} value - Value to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted value
 */
const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined) return 'N/A';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: value < 1 ? 6 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2
  }).format(value);
};

/**
 * Formats volume value
 * @param {number} value - Volume value
 * @returns {string} Formatted volume
 */
const formatVolume = (value) => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
};

/**
 * Generates gradient for chart
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} chartArea - Chart area
 * @param {Array} colors - Gradient colors
 * @returns {CanvasGradient} Gradient
 */
export const createGradient = (ctx, chartArea, colors = ['#3498db', 'transparent']) => {
  if (!chartArea) return colors[0];

  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });

  return gradient;
};

/**
 * Calculates optimal tick values
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} targetTicks - Target number of ticks
 * @returns {Array} Tick values
 */
export const calculateTicks = (min, max, targetTicks = 5) => {
  const range = max - min;
  const roughStep = range / targetTicks;

  // Find a nice step size
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const options = [1, 2, 2.5, 5, 10];
  const step = options.find(opt => opt * magnitude >= roughStep) * magnitude;

  const ticks = [];
  let current = Math.ceil(min / step) * step;

  while (current <= max) {
    ticks.push(current);
    current += step;
  }

  return ticks;
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Themes
  ChartThemes,
  getChartTheme,

  // Configuration builders
  createBaseChartConfig,
  createLineChartConfig,
  createAreaChartConfig,
  createCandlestickConfig,
  createBarChartConfig,
  createPieChartConfig,
  createRadarChartConfig,

  // Annotations
  createHorizontalLine,
  createVerticalLine,
  createBoxAnnotation,
  createSupportResistanceAnnotations,

  // Data transformers
  transformToChartData,
  sampleChartData,
  fillDataGaps,
  normalizeToPercentage,

  // Tooltip formatters
  createPriceTooltipFormatter,
  createOHLCTooltipFormatter,

  // Update utilities
  updateChartData,
  addRealtimePoint,

  // Utilities
  createGradient,
  calculateTicks
};
