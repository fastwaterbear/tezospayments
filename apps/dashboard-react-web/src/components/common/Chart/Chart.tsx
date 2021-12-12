import { init, getInstanceByDom, EChartsOption, ECharts, SetOptionOpts } from 'echarts';
import React, { useRef, useEffect, CSSProperties } from 'react';

import { combineClassNames } from '@tezospayments/common';

import './Chart.scss';

interface ChartProps {
  option: EChartsOption;
  className?: string;
  style?: CSSProperties;
  theme?: 'light' | 'dark';
  settings?: SetOptionOpts;
  loading?: boolean;
}

export const Chart = ({
  option,
  theme,
  className,
  style,
  settings,
  loading,
}: ChartProps) => {
  const chartElRef = useRef<HTMLDivElement>(null);
  theme = theme || 'light';

  useEffect(() => {
    let chart: ECharts | undefined;
    if (chartElRef.current) {
      chart = init(chartElRef.current, theme);
    }

    const handleResize = () => {
      chart?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart?.dispose();
    };
  }, [theme]);

  useEffect(() => {
    if (chartElRef.current) {
      const chart = getInstanceByDom(chartElRef.current);
      chart?.setOption(option, settings);
    }
  }, [option, settings, theme]);

  useEffect(() => {
    if (chartElRef.current) {
      const chart = getInstanceByDom(chartElRef.current);
      loading === true ? chart?.showLoading() : chart?.hideLoading();
    }
  }, [loading, theme]);

  return <div className={combineClassNames('chart-container', className)} ref={chartElRef} style={{ width: '100%', height: '100%', ...style }} />;
};

export const ChartPure = React.memo(Chart);
