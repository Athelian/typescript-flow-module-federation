// @flow

export type MetricEnumType = 'distance' | 'area' | 'volume' | 'weight' | 'duration';

export const getMetrics = (metricType?: MetricEnumType): Array<string> => {
  if (metricType) {
    switch (metricType) {
      case 'distance':
        return ['cm', 'm'];
      case 'area':
        return ['cm²', 'm²'];
      case 'volume':
        return ['cm³', 'm³'];
      case 'weight':
        return ['g', 'kg', 'ton'];
      case 'duration':
        return ['days', 'weeks', 'months'];
      default:
        return [];
    }
  }

  return [];
};

export const getConvert = (metricType?: MetricEnumType): Function => {
  if (metricType) {
    switch (metricType) {
      case 'distance':
        return (value: number, metric: string, newMetric: string) => {
          if (metric === 'm' && newMetric === 'cm') return value * 100;
          if (metric === 'cm' && newMetric === 'm') return value / 100;
          return value;
        };
      case 'area':
        return (value: number, metric: string, newMetric: string) => {
          if (metric === 'm²' && newMetric === 'cm²') return value * 1e4;
          if (metric === 'cm²' && newMetric === 'm²') return value / 1e4;
          return value;
        };
      case 'volume':
        return (value: number, metric: string, newMetric: string) => {
          if (metric === 'm³' && newMetric === 'cm³') return value * 1e6;
          if (metric === 'cm³' && newMetric === 'm³') return value / 1e6;
          return value;
        };
      case 'weight':
        return (value: number, metric: string, newMetric: string) => {
          if ((metric === 'g' && newMetric === 'kg') || (metric === 'kg' && newMetric === 'ton'))
            return value / 1e3;
          if ((metric === 'kg' && newMetric === 'g') || (metric === 'ton' && newMetric === 'kg'))
            return value * 1e3;
          if (metric === 'g' && newMetric === 'ton') return value / 1e6;
          if (metric === 'ton' && newMetric === 'g') return value * 1e6;
          return value;
        };
      case 'duration':
        // No conversion
        return (value: number) => value;
      default:
        return (value: number) => value;
    }
  }

  return (value: number) => value;
};
