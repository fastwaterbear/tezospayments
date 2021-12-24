import { init, getInstanceByDom, EChartsOption, ECharts, SetOptionOpts } from 'echarts';
import React, { useRef, useEffect, CSSProperties, useMemo } from 'react';

import { combineClassNames } from '@tezospayments/common';

import './Chart.scss';

type ChartOptions = React.ComponentProps<typeof ChartPure>['option'];

interface ChartProps {
  option: EChartsOption;
  className?: string;
  style?: CSSProperties;
  theme?: 'light' | 'dark';
  settings?: SetOptionOpts;
  loading?: boolean;
  title?: string;
  showZoom?: boolean;
}

export const Chart = (props: ChartProps) => {
  const chartElRef = useRef<HTMLDivElement>(null);
  const theme = props.theme || 'light';

  const option = useMemo(() => {
    const showZoom = props.showZoom === undefined || props.showZoom;

    const grid: ChartOptions['grid'] = {
      top: 80,
      left: 0,
      right: 0,
      containLabel: true
    };
    if (!showZoom)
      grid.bottom = 0;

    const legend: ChartOptions['legend'] = {
      top: 35,
      left: 0,
      padding: 0,
      align: 'left',
      type: 'scroll'
    };

    return {
      title: {
        text: props.title,
        padding: 0,
      },
      dataZoom: showZoom ? [{
        type: 'inside',
      }, {
        type: 'slider'
      }] : undefined,
      ...props.option,
      grid: { ...grid, ...props.option.grid },
      legend: { ...legend, ...props.option.legend },
    };
  }, [props.option, props.showZoom, props.title]);

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
      chart?.setOption(option, props.settings);
    }
  }, [option, props.settings, theme]);

  useEffect(() => {
    if (chartElRef.current) {
      const chart = getInstanceByDom(chartElRef.current);
      props.loading === true ? chart?.showLoading() : chart?.hideLoading();
    }
  }, [props.loading, theme]);

  return <div className={combineClassNames('chart-container', props.className)} ref={chartElRef} style={{ width: '100%', height: '100%', ...props.style }} />;
};

export const ChartPure = React.memo(Chart);
