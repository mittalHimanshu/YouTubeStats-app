import { DataService } from './data.service';
import { Component, OnInit, ModuleWithComponentFactories } from '@angular/core';
import { ElectronService } from 'ngx-electron'
import * as Plotly from './plotly-latest.min'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  channelInfo: any = []
  channelSubscription: Subscription
  private count = 0
  private isLoading: boolean

  constructor(
    private _electron: ElectronService,
    private _data: DataService
  ) { }

  ngOnInit() {
    this.channelInfo = []
    this.isLoading = false
  }

  closeWindow = () => {
    this._electron.ipcRenderer.send('close-window')
  }

  minimizeWindow = () => {
    this._electron.ipcRenderer.send('minimize-window')
  }

  initializeChart = () => {
    Plotly.plot('chart', [{
      x: [],
      y: [],
      type: "line",
      line: { shape: 'spline' }
    }], {
        xaxis: {
          rangemode: 'tozero',
          autorange: true,
          showgrid: true,
          zeroline: false,
          showline: false,
          showticklabels: true,
          automargin: true
        },
        yaxis: {
          rangemode: 'nonnegative',
          autorange: true,
          showgrid: false,
          zeroline: false,
          automargin: true,
          showline: false,
          showticklabels: true
        }
      },
      { responsive: true }
    )
  }

  channel = name => {

    this.isLoading = true

    if (this.channelSubscription)
      this.channelSubscription.unsubscribe()

    this.initializeChart()

    this.channelSubscription = this._data.getStats(name).subscribe(
      (res: any) => {
        this.isLoading = false
        this.channelInfo = res
        let d1 = new Date()
        Plotly.extendTraces('chart', {
          x: [[d1]],
          y: [[parseInt(res.items.map(item => item.statistics.subscriberCount)[0])]]
        }, [0])
        if (this.count > 10) {
          let d2 = new Date(d1)
          d2.setSeconds(d1.getSeconds() - 10)
          Plotly.relayout('chart', {
            xaxis: {
              range: [d2, d1]
            }
          })
        }
        this.count += 1
      }
    )
  }
}