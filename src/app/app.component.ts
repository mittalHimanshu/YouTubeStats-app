import { DataService } from './data.service';
import { Component, OnInit, ModuleWithComponentFactories } from '@angular/core';
import { ElectronService } from 'ngx-electron'
import * as moment from 'moment'
import * as CanvasJS from './canvasjs.min';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  channelInfo: any = []
  dps: any = []
  x: any
  chart: any
  channelSubscription: Subscription

  private data = [{
    x: [],
    y: [],
    mode: 'lines',
    line: { color: '#80CAF6' }
  }]

  constructor(
    private _electron: ElectronService,
    private _data: DataService
  ) { }

  ngOnInit() {
    this.channelInfo = []
    this.x = 0
    this.chart = new CanvasJS.Chart("chartContainer", {
      exportEnabled: true,
      title: {
        text: "Live Subscriber Count"
      },
      axisY: {
        includeZero: false,
        gridThickness: 0
      },
      data: [{
        type: "spline",
        dataPoints: this.dps
      }]
    });
  }

  closeWindow = () => {
    this._electron.ipcRenderer.send('close-window')
  }

  minimizeWindow = () => {
    this._electron.ipcRenderer.send('minimize-window')
  }

  channel = name => {

    if(this.channelSubscription)
      this.channelSubscription.unsubscribe()

    this.channelSubscription = this._data.getStats(name).subscribe(
      (res: any) => {
        this.channelInfo = res
        this.dps.push({
          x: this.x,
          y: parseInt(res.items.map(item => item.statistics.subscriberCount)[0])
        })
        console.log(this.dps)
        this.x += 1
        if (this.dps.length > 10) {
          this.dps.shift();
        }
        this.chart.render()
      }
    )
  }
}