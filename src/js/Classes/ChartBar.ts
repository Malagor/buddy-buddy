import { Chart } from 'chart.js';
import { Currencies } from './Currencies';

export class ChartBar {
  protected element: HTMLElement;

  protected constructor(element: string) {
    this.element = document.querySelector(element);
  }

  static create(element: string): ChartBar {
    const chart: ChartBar = new ChartBar(element);
    chart.render = chart.render.bind(chart);
    return chart;
  }

  async getConfig(data: any[], groupData: any) {
    const labelsOfUser: any[] = data.map((item: any) => [`${item.userName},`, `<${item.userId}>`]);
    const groupCurrency: string = groupData.curr;
    const balancesArray: any = [];
    const query = Currencies.fromUSD(groupCurrency);
    const balances: any[] = data.map((item: any) => item.userBalance);
    const rightBalances: any = await balances.map(async (sum: number) => {
      await query(sum).then((bal: number) => {
        balancesArray.push(bal.toFixed(2));
        return bal;
      });
    });
    await Promise.all(rightBalances).then(data => data);

    const dataInfo: any = {
      labels: labelsOfUser,
      datasets: [{
        label: "Dataset #1",
        backgroundColor: balancesArray.map((item: number) => {
          if (item > 0) {
            return "rgba(0, 250, 0, 0.3)";
          } else {
            return "rgba(255, 0, 0, 0.3)";
          }
        }),
        borderColor: balancesArray.map((item: number) => {
          if (item > 0) {
            return "rgba(0, 250, 0, 0.5)";
          } else {
            return "rgba(255, 0, 0, 0.5)";
          }
        }),
        borderWidth: 2,
        hoverBackgroundColor: balancesArray.map((item: number) => {
          if (item > 0) {
            return "rgba(0, 250, 0, 0.5)";
          } else {
            return "rgba(255, 0, 0, 0.5)";
          }
        }),
        hoverBorderColor: balancesArray.map((item: number) => {
          if (item > 0) {
            return "rgba(0,100, 0, 0.8)";
          } else {
            return "rgba(255, 0, 0, 0.8)";
          }
        }),
        data: balancesArray,
        },]
      };
      
      const optionsInfo: any = {
      maintainAspectRatio: false,
      responsive: true,
      title: {
        display: true,
        text: groupData.groupTitle,
        padding: 15,
      },
      legend: {
        display: false,
      },
      scales: {
        yAxes: [{
          ticks: {
            callback(value: number) {
              return `${value} ${groupCurrency}`;
            },
            maxTicksLimit: 10
          },
          stacked: true,
          gridLines: {
            display: true,
            color: "rgba(0, 0, 0, 0.05)"
          }
        }],
        xAxes: [{
          gridLines: {
            display: false
          }
        }]
      },
      tooltips: {
        caretSize: 0,
        bodySpacing: 5,
        xPadding: 10,
        displayColors: false,
        titleAlign: 'center',
        titleMarginBottom: 5,
        bodyAlign: 'center',
        callbacks: {
          title(toolTipItems: any) {
            return toolTipItems[0].xLabel.join('\n');            
          },
          label(toolTipItems: any) {
            return `${toolTipItems.value} ${groupCurrency}`; 
          },
        }

      }
      };

    return {
      type: 'bar',
      data: dataInfo,
      options: optionsInfo,
    }
  }

  render = (userList: [string | number]): void => {
    console.log(userList);
    const dt: any[]= [{userName: 'Darya', userId: '@daryatema', userBalance: 100},
    {userName: 'Alex', userId: '@malagor', userBalance: 300},
    {userName: 'Olga', userId: '@gruzyn33', userBalance: 100},
    {userName: 'Andrei', userId: '@andrei', userBalance: -500},
    {userName: 'Darya', userId: '@daryatema', userBalance: 100},
    {userName: 'Alex', userId: '@malagor', userBalance: 300},
    {userName: 'Olga', userId: '@gruzyn33', userBalance: 100},
    {userName: 'Andrei', userId: '@andrei', userBalance: -500},
    {userName: 'Darya', userId: '@daryatema', userBalance: 100},
    {userName: 'Alex', userId: '@malagor', userBalance: 300},
    {userName: 'Olga', userId: '@gruzyn33', userBalance: 100},
    {userName: 'Andrei', userId: '@andrei', userBalance: -500},
  ];
  const groupData = {curr: 'BYN', groupTitle: 'Our group'};
    
    this.element.innerHTML = `
    <canvas id="ChartBar" width="100" height="300" class="ChartBar">
    </canvas>`;

    const canvas = document.getElementById('ChartBar') as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

    const config: any = this.getConfig(dt, groupData).then(data => {
      const myChart = new Chart(ctx, data);
    });
  }
}