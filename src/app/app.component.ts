import { DataService } from './data.service';
import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  channelInfo: any = []
  channelSubscription: Subscription

  constructor(
    private _electron: ElectronService,
    private _data: DataService
  ){}

  ngOnInit(){
    this.channelInfo = []
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
      res => this.channelInfo = res
    )
  }

}
