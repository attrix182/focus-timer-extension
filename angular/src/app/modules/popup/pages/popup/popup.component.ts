import { Component, Inject } from '@angular/core';
import { bindCallback } from 'rxjs';
import { map } from 'rxjs/operators';
import { TAB_ID } from '../../../../providers/tab-id.provider';

@Component({
  selector: 'app-popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['popup.component.scss']
})
export class PopupComponent {
  time: any;

  constructor(@Inject(TAB_ID) readonly tabId: number) {}

  async stopTimer(): Promise<void> {
    await bindCallback<any, any>(chrome.tabs.sendMessage.bind(this, this.tabId, { stop: true }))()
      .pipe(
        map((msg) =>
          chrome.runtime.lastError ? 'The current page is protected by the browser, goto: JIRA and try again.' : msg
        )
      )
      .toPromise();
  }

  async startTimer(duration): Promise<void> {
    await bindCallback<any, any>(chrome.tabs.sendMessage.bind(this, this.tabId, { duration }))()
      .pipe(
        map((msg) =>
          chrome.runtime.lastError ? 'The current page is protected by the browser, goto: JIRA and try again.' : msg
        )
      )
      .toPromise();
  }
}
