import { DataService } from './data.service';
import { Component, OnInit, ModuleWithComponentFactories } from '@angular/core';
import { ElectronService } from 'ngx-electron'
import * as moment from 'moment'
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

  constructor(
    private _electron: ElectronService,
    private _data: DataService
  ) { }

  ngOnInit() {
    this.channelInfo = []
    Plotly.plot('chart', [{
      x: [],
      y: [],
      type: "line"
    }], {
        xaxis: {
          rangemode: 'tozero',
          autorange: true,
          showgrid: true,
        },
        yaxis: {
          rangemode: 'nonnegative',
          autorange: true,
          showgrid: true,
        }
      })
  }

  closeWindow = () => {
    this._electron.ipcRenderer.send('close-window')
  }

  minimizeWindow = () => {
    this._electron.ipcRenderer.send('minimize-window')
  }

  channel = name => {

    if (this.channelSubscription)
      this.channelSubscription.unsubscribe()

    this.channelSubscription = this._data.getStats(name).subscribe(
      (res: any) => {
        this.channelInfo = res
        Plotly.extendTraces('chart', {
          x: [[this.count]],
          y: [[parseInt(res.items.map(item => item.statistics.subscriberCount)[0])]]
        }, [0])
        if (this.count > 10) {
          Plotly.relayout('chart', {
            xaxis: {
              range: [this.count-10, this.count]
            }
          })
        }
        this.count += 1
      }
    )
  }
}