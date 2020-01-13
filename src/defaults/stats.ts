import { ApexOptions } from 'apexcharts'

const colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8']

export const $StatsLocksView = {
  ranges: [] as Array<string>,
  keyholders: [] as Array<any>,
  keyholderLocks: 0,
  keyholdersCount: 0,
  keyholderAvgRating: 0,
  botLocks: 0,
  selfLocks: 0,
  totalLocks: 0,
  keyholderTrust: 0.0,
  botTrust: 0.0,
  trusted: 0,
  frozenLocks: 0,
  // Lock interval
  distributionByInterval: {
    series: [] as Array<{ name: 'Count'; data: Array<number> }>,
    chartOptions: {
      chart: {
        height: 350,
        type: 'bar'
      },
      title: {
        text: 'Distribution by Interval',
        offsetY: 0,
        align: 'center'
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          dataLabels: {
            position: 'top',
            distributed: true
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#444']
        }
      },
      xaxis: {
        categories: ['15 min', '30 min', '1 hr', '3 hr', '6 hr', '12 hr', '24 hr'],
        labels: {
          style: {
            fontSize: '14px'
          }
        }
      },
      yaxis: {
        show: false
      }
    } as ApexOptions
  },
  // Lock Type
  distributionByLockType: {
    series: [] as Array<number>,
    chartOptions: {
      labels: ['Fixed', 'Variable'],
      title: {
        text: 'Fixed vs Variable',
        offsetY: 0,
        align: 'center'
      },
      legend: {
        position: 'bottom'
      },
      colors
    } as ApexOptions
  },
  // Cards Remaining
  distributionByCardsRemaining: {
    series: [] as Array<number>,
    chartOptions: {
      labels: ['Reset', 'Green', 'Yellow', 'Red', 'Double Up', 'Freeze'],
      title: {
        text: 'Cards Remaining (Card info shown)',
        offsetY: 0,
        align: 'center'
      },
      legend: {
        position: 'bottom'
      },
      colors
    } as ApexOptions
  },
  // Lock Length
  distributionByLockLength: {
    series: [] as Array<{ name: string; type?: string; data: Array<number> }>,
    chartOptions: {
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 4
      } as any,
      title: {
        text: 'Locks by Running Length',
        align: 'center'
      },
      xaxis: {
        type: 'category',
        categories: ['<1h', '12h', '1d', '5d', '10d', '20d', '30d', '60d', '90d', '120d', '180d', '250d', '> 250d']
      },
      yaxis: [
        {
          axisTicks: {
            show: false
          },
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            style: {
              color: '#008FFB'
            }
          },
          title: {
            text: 'Count',
            style: {
              color: '#008FFB'
            }
          },
          tooltip: {
            enabled: true
          }
        }
      ],
      tooltip: {
        shared: false
      },
      legend: {
        horizontalAlign: 'center'
      },
      colors
    } as ApexOptions
  }
}
