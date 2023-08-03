import { Component, Inject, OnInit } from '@angular/core';
import { TAB_ID } from '../../../../providers/tab-id.provider';
import { bindCallback, map } from 'rxjs';

@Component({
  selector: 'app-popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['popup.component.scss']
})
export class PopupComponent implements OnInit {
  duration: number;
  eta: string = '';

  constructor(@Inject(TAB_ID) readonly tabId: number) {}

  ngOnInit(): void {
    this.detectChangeTab();
  }

  async detectChangeTab(): Promise<void> {
    const tab = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    this.sendChangeTab(tab[0].id);
  }

  sendChangeTab(tabID){
    chrome.tabs.sendMessage(tabID, { tabChanged: true });
  }

  async startTimer(duration: number, tabId = this.tabId): Promise<void> {
    this.duration = duration;
    chrome.tabs.sendMessage(tabId, { duration });
  }

  async stopTimer(): Promise<void> {
    chrome.tabs.sendMessage(this.tabId, { stop: true });
  }
}
