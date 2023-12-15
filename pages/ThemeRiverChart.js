import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

function ThemeRiverChart({ data }) {
    const chartRef = useRef(null);

    useEffect(() => {
        const myChart = echarts.init(chartRef.current);

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: 'rgba(0,0,0,0.2)',
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            singleAxis: {
                type: 'time',
                axisPointer: {
                    animation: true
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        opacity: 0.2
                    }
                }
            },
            series: [
                {
                    type: 'themeRiver',
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.8)'
                        }
                    },
                    data: data
                }
            ]
        };

        myChart.setOption(option);

        window.addEventListener('resize', myChart.resize);

        return () => {
            window.removeEventListener('resize', myChart.resize);
        };
    }, [data]);

    return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
}

export default ThemeRiverChart;
