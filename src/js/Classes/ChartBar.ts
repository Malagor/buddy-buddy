import { Chart } from 'chart.js';
import { Currencies } from './Currencies';

type userListArray = [
  userDataObject[],
  {[key: string]: string}
];

type userDataObject = {
  [key: string]: string | number
};

type configData = {
  [key: string]: string | Array< number | string | string[] >
};

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

  buildingChart = (userList: userListArray): void => {
    this.renderChart();
    this.getDataForChartConfig(userList).then((data: configData) => {
      const config: { [key: string]: any } = this.getConfigForChart(data);
      const chart: Chart = this.getChart(config);
      this.getAvatarsLocation(chart, userList[0]);
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

  async getDataForChartConfig(data: userListArray) {
    const labelsOfUser: string[][] = data[0].map((item: userDataObject) => [`${item.name},`, `<${item.account}>`]);
    const groupCurrency: string = data[1].currency;
    const colors: string[] = this.getArrayOfColors(data[0]);
    const opacityColors: string[] = colors.map((item: string) => item + '80');
    const balancesArray: any[] = [];
    const query: any = Currencies.fromUSD(groupCurrency);
    const rightBalances: any[] = await data[0].map((item: userDataObject) => item.userBalance)
    .map(async (sum: number) => {
      await query(sum).then((bal: number) => {
        balancesArray.push(bal.toFixed(2));
      });
    });
    await Promise.all(rightBalances).then((data: number[]) => data);

    return {
      labelsOfUser: labelsOfUser,
      groupCurrency: groupCurrency,
      colors: colors,
      opacityColors: opacityColors,
      rightBalances: balancesArray,
      groupTitle: data[1].groupTitle,
    };
  }

  generateRandomColor(): string {
    const letters: string = '0123456789ABCDEF';
    let color: string = '#';
    for (let i = 0; i < 6; i += 1) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }

  getArrayOfColors(data: userDataObject[]): string[] {
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

  getConfigForChart(configData: configData): { [key: string]: any } {
    const dataInfo: any = {
      labels: configData.labelsOfUser,
      datasets: [{
        label: configData.groupTitle,
        backgroundColor: configData.opacityColors,
        hoverBackgroundColor: configData.colors,
        data: configData.rightBalances,
        }, ]
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
            color: 'rgba(0, 0, 0, 0.05)'
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
    };
  }

  getChart(config: { [key: string]: any }): Chart {
    const canvas = document.getElementById('ChartBar') as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    return new Chart.Chart(ctx, config);
  }

  getAvatarsLocation(chart: any, data: userDataObject[]) {
    const xAxis: any = chart.scales['x-axis-0'];
    xAxis.ticks.forEach((_: void, index: number) => {
      const x = xAxis.getPixelForTick(index);
      const html = `<div class="wr" style="left: ${x - 12}px;">
        <img src="${data[index].avatar}" alt="${data[index].name}">
      </div>`;
      document.querySelector('.images-for-canvas').insertAdjacentHTML('beforeend', html);
    });
  }

  eventsForChart(chart: any): void {
    window.addEventListener('resize', () => {
      const avatars: any = document.querySelector('.images-for-canvas').querySelectorAll('.wr');
      const xAxis: any = chart.scales['x-axis-0'];
      xAxis.ticks.forEach((_: any, index: number) => {
        const x: number = xAxis.getPixelForTick(index);
        avatars[index].style.left = `${x - 12}px`;
      });
    });
  }
}
