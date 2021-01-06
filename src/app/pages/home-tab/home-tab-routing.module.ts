import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeTabPage } from './home-tab.page';
import { HomePage } from './home/home.page';
import { MessagesPage } from '../common/messages/messages.page';
import { AttendancePage } from './attendance/attendance.page';
import { FriendsPage } from './friends/friends.page';

const routes: Routes = [
  {
    path: 'tab',
    component: HomeTabPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            component: HomePage
          }
        ]
      },
      // {
      //   path: 'messages',
      //   children: [
      //     {
      //       path: '',
      //       component: CometchatEmbeddedComponent
      //     }
      //   ]
      // },
      {
        path: 'attendance',
        children: [
          {
            path: '',
            component: AttendancePage
          }
        ]
      },
      {
        path: 'friends',
        children: [
          {
            path: '',
            component: FriendsPage
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeTabPageRoutingModule { }
