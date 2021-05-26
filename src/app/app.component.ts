import { Component } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { CovidService } from './covid.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  chartData: ChartDataSets[] = [
    {
      data: [],
      label: 'Active'
    }
  ];
  chartDeathData: ChartDataSets[] = [
    {
      data: [],
      label: 'Closed'
    }
  ];
  barChartData: ChartDataSets[] = [
    {
      data: [],
      label: 'Daily New Cases'
    }
  ];
  barDeathData: ChartDataSets[] = [
    {
      data: [],
      label: 'Daily Deaths'
    }
  ];
  barChartLabels: Label[] = [];
  barDeathLabels: Label[] = [];
  chartLabels: Label[] = [];
  chartDeathLabels: Label[] = [];
  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
        }
      }],
      yAxes: [
        {
          ticks: {
            min: 100000,
            max: 1000000,
            stepSize: 100000
          }
        }
      ]
    }
  };
  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
        }
      }],
      yAxes: [
        {
          ticks: {
            min: 100000,
            max: 1000000,
            stepSize: 100000
          }
        }
      ]
    },
  };
  lineDeathColors = [{
    backgroundColor: 'transparent',
    borderColor: '#ff9900',
    pointBackgroundColor: '#ff9900',
    pointBorderColor: '#ff9900',
    pointHoverBackgroundColor: '#ff9900',
    pointHoverBorderColor: '#ff9900'
  }];
  lineChartColors = [{
    backgroundColor: 'transparent',
    borderColor: '#33ccff',
    pointBackgroundColor: '#33ccff',
    pointBorderColor: '#33ccff',
    pointHoverBackgroundColor: '#33ccff',
    pointHoverBorderColor: '#33ccff'
  }];
  barChartColors = [{
  }]
  title = 'covid19';
  deathsByCont: any = {};
  deathsByDate: any = {};
  casesByDate: any = {};
  recoveredByDate: any = {};
  totalDeaths: number = 0;
  totalCases: number = 0;
  totalRecovered: number = 0;
  totalActive: number = 0;
  totalCritical: number = 0;
  dataSource: Array<string> = [];

  constructor(private covidSerivce: CovidService) { }

  ngOnInit() {
    Promise.all([this.getDetailsByCont(),
    this.getGlobalDetails(),
    this.getTodayDetails()])
      .then(results => {
        console.log(results);
      }).catch(error => {
        console.log(error);
      })
    this.showGraphs();
  }

  showGraphs() {
    let card = document.querySelector('.card');
    if (null !== card) {
      card.addEventListener('click', function () {
        if (null !== card)
          card.classList.toggle('is-flipped');
      });
    }
    let rcard = document.querySelector('.rcard');
    if (null !== rcard) {
      rcard.addEventListener('click', function () {
        if (null !== rcard)
          rcard.classList.toggle('is-flipped');
      });
    }
  }

  getDetailsByCont() {
    return new Promise((resolve, reject) => {
      this.covidSerivce.getDetailsByCont().subscribe((resp: any) => {
        if (resp) {
          Object.keys(resp).forEach(i => {
            if(!resp[i]['All']['country']) {
              resp[i]['All']['country'] = i;
            }
            this.dataSource.push(resp[i]['All']);
          });
          resolve("All details are fetched!");
        } else {
          reject(new Error('Unable to fetch the API data'));
        }
      });
    });
  }

  getTodayDetails() {
    return new Promise((resolve, reject) => {
      this.covidSerivce.getTodayDetails().subscribe(resp => {
        if (resp) {
          this.casesByDate = resp['cases'];
          this.deathsByDate = resp['deaths'];
          for (let key in this.casesByDate) {
            if (this.chartData[0]['data'] && this.barChartData[0]['data']) {
              this.chartData[0]['data'].push(this.casesByDate[key]);
              this.barChartData[0]['data'].push(this.casesByDate[key]);
              let dateKey = new Date(key).toDateString();
              dateKey = dateKey.substring(dateKey.indexOf(" "), dateKey.length);
              this.chartLabels.push(dateKey);
              this.barChartLabels.push(dateKey);
            }
          }
          for (let key in this.deathsByDate) {
            if (this.chartDeathData[0]['data'] && this.barDeathData[0]['data']) {
              this.chartDeathData[0]['data'].push(this.deathsByDate[key]);
              this.barDeathData[0]['data'].push(this.deathsByDate[key]);
              let dateKey = new Date(key).toDateString();
              dateKey = dateKey.substring(dateKey.indexOf(" "), dateKey.length);
              this.chartDeathLabels.push(dateKey);
              this.barDeathLabels.push(dateKey);
            }
          }
          resolve("Today data is fetched!")
        } else {
          reject(new Error("Unable to fetch the API data"));
        }
      });
    });
  }

  getGlobalDetails() {
    return new Promise((resolve, reject) => {
      this.covidSerivce.getGlobalDetails().subscribe(resp => {
        if (resp) {
          this.totalCases = resp['cases'];
          this.totalDeaths = resp['deaths'];
          this.totalRecovered = resp['recovered'];
          this.totalActive = resp['active'];
          this.totalCritical = resp['critical'];
          resolve("Global data is fetched!");
        } else {
          reject(new Error("Unable to fetch the API data"));
        }
      });
    });
  }
}
