import { Chart } from 'chart.js';
import { Currencies } from './Currencies';

export class ChartBar {
  protected element: HTMLElement;

  protected constructor(element: string) {
    this.element = document.querySelector(element);
  }

  static create(element: string): ChartBar {
    const chart: ChartBar = new ChartBar(element);
    chart.buildingChart = chart.buildingChart.bind(chart);
    return chart;
  }

  buildingChart = (userList: [string | number]): void => {
    console.log(userList);
    const dt: any[]= [{userName: 'Darya', userId: '@daryatema', userBalance: 100, userAvatar: "https://firebasestorage.googleapis.com/v0/b/buddy-buddy-8e497.appspot.com/o/avatars%2F6yiqUegBoWWdR5oiZgTVqUt871q2.jpg?alt=media&token=d8308ef6-00d1-4ba7-aa77-eb396c46639e"},
    {userName: 'Alex', userId: '@malagor', userBalance: 300, userAvatar: "https://firebasestorage.googleapis.com/v0/b/buddy-buddy-8e497.appspot.com/o/avatars%2F6yiqUegBoWWdR5oiZgTVqUt871q2.jpg?alt=media&token=d8308ef6-00d1-4ba7-aa77-eb396c46639e"},
    {userName: 'Olga', userId: '@gruzyn33', userBalance: 100, userAvatar: "https://firebasestorage.googleapis.com/v0/b/buddy-buddy-8e497.appspot.com/o/avatars%2F6yiqUegBoWWdR5oiZgTVqUt871q2.jpg?alt=media&token=d8308ef6-00d1-4ba7-aa77-eb396c46639e"},
    {userName: 'Andrei', userId: '@andrei', userBalance: -500, userAvatar: "https://firebasestorage.googleapis.com/v0/b/buddy-buddy-8e497.appspot.com/o/avatars%2F6yiqUegBoWWdR5oiZgTVqUt871q2.jpg?alt=media&token=d8308ef6-00d1-4ba7-aa77-eb396c46639e"},
    {userName: 'Darya', userId: '@daryatema', userBalance: 100, userAvatar: "https://firebasestorage.googleapis.com/v0/b/buddy-buddy-8e497.appspot.com/o/avatars%2F6yiqUegBoWWdR5oiZgTVqUt871q2.jpg?alt=media&token=d8308ef6-00d1-4ba7-aa77-eb396c46639e"},
    {userName: 'Alex', userId: '@malagor', userBalance: 300, userAvatar: "https://firebasestorage.googleapis.com/v0/b/buddy-buddy-8e497.appspot.com/o/avatars%2F6yiqUegBoWWdR5oiZgTVqUt871q2.jpg?alt=media&token=d8308ef6-00d1-4ba7-aa77-eb396c46639e"},
  ];
    const groupData = {curr: 'BYN', groupTitle: 'Our group'};
    this.renderChart();
    this.getDataForChartConfig(dt, groupData).then((data: any) => {
      const config: any = this.getConfigForChart(data);
      const chart: Chart = this.getChart(config);
      this.getAvatarsLocation(chart, dt);
      this.eventsForChart(chart);
    });
  }

  renderChart = (): void => {
    this.element.innerHTML = `
    <div class="chart-wrapper">
    <canvas id="ChartBar" width="100" height="60" class="ChartBar">
    </canvas>
    </div>
    <div class="images-for-canvas">
    </div>
    `;
  }

  async getDataForChartConfig(data: any[], groupData: any) {
    const labelsOfUser: any[] = data.map((item: any) => [`${item.userName},`, `<${item.userId}>`]);
    const groupCurrency: string = groupData.curr;
    const colors: string[] = this.getArrayOfColors(data);
    const opacityColors: string[] = colors.map((item: string) => item + '80');
    const balancesArray: any = [];
    const query = Currencies.fromUSD(groupCurrency);
    const rightBalances: any = await data.map((item: any) => item.userBalance)
    .map(async (sum: number) => {
      await query(sum).then((bal: number) => {
        balancesArray.push(bal.toFixed(2));
      });
    });
    await Promise.all(rightBalances).then(data => data);

    return {
      labelsOfUser: labelsOfUser,
      groupCurrency: groupCurrency,
      colors: colors,
      opacityColors: opacityColors,
      rightBalances: balancesArray,
      groupTitle: groupData.groupTitle,
    }
  }

  generateRandomColor(): string {
    const letters: string = '0123456789ABCDEF';
    let color: string = '#';    
    for (let i = 0; i < 6; i += 1) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }

  getArrayOfColors(data: any[]): string[] {
    const colorSet: Set<string> = new Set();
    data.map((_: any) => {
      let color: string;
      do {
        color = this.generateRandomColor();
      } while (colorSet.has(color));

      colorSet.add(color);
    });

    return Array.from(colorSet);
  }

  getConfigForChart(configData: any): any {
    const dataInfo: any = {
      labels: configData.labelsOfUser,
      datasets: [{
        label: configData.groupTitle,
        backgroundColor: configData.opacityColors,
        hoverBackgroundColor: configData.colors,
        data: configData.rightBalances,
        },]
      };
    
    const optionsInfo: any = {
      maintainAspectRatio: true,
      responsive: true,
      title: {
        display: true,
        text: `${configData.groupTitle} - ${configData.groupCurrency}`,
        padding: 10,
      },
      legend: {
        display: false,
      },
      scales: {
        yAxes: [{
          ticks: {
            maxTicksLimit: 10,
            fontSize: 10,
          },
          gridLines: {
            display: true,
            color: "rgba(0, 0, 0, 0.05)"
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            autoSkip: false,
          },
          gridLines: {
            display: false
          },
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
            return `${toolTipItems.value} ${configData.groupCurrency}`; 
          },
        },
      },
    };

    return {
      type: 'bar',
      data: dataInfo,
      options: optionsInfo,
    }
  }

  getChart(config: any): Chart {
    const canvas = document.getElementById('ChartBar') as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    const myChart: Chart = new Chart(ctx, config);

    return myChart;
  }

  getAvatarsLocation(chart: any, data: any[]) {
    const xAxis: any = chart.scales['x-axis-0'];
    xAxis.ticks.forEach((_: any, index: number) => {
      const x = xAxis.getPixelForTick(index);
      const html = `<div class="wr" style="left: ${x - 12}px;">
        <img src="${data[0].userAvatar}">
      </div>`;
      document.querySelector('.images-for-canvas').insertAdjacentHTML('beforeend', html);
    })
  }

  eventsForChart(chart: any): void {
    window.addEventListener('resize', () => {
      const avatars: any = document.querySelector('.images-for-canvas').querySelectorAll('.wr');
      const xAxis: any = chart.scales['x-axis-0'];
      xAxis.ticks.forEach((_: any, index: number) => {
        const x = xAxis.getPixelForTick(index);
        avatars[index].style.left = `${x - 12}px`;
      });
    });
  }
}