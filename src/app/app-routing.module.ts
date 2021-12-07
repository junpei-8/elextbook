import { NgModule } from '@angular/core';
import { RouterModule, Route as BaseRoute } from '@angular/router';
import { MetaData } from './services/meta.service';
import { HomeComponent } from './views/home/home.component';
import { NotFoundComponent } from './views/not-found/not-found.component';

export type RootRouteNames = 'home' | 'graph' | 'workbook' | 'library' | 'settings' | 'sign-in' | 'sing-up';

export interface RouteData extends MetaData {
  key: string;

  root?: {
    key: RootRouteNames;
    index?: number;
  }
}

export interface Route extends BaseRoute {
  data?: RouteData;
}
export type Routes = Route[];

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: {
      key: 'home',
      title: 'ホーム',
      desc: 'Elextbook（エレクトブック）は、第１種・第２種電気工事士や危険物乙種などの過去問題をクイズ形式で解くことができるアプリです。対応するブラウザであれば、PWAアプリケーションとして Windows・Android・iOS へのインストールが可能です。',
      root: {
        key: 'home',
        index: 0
      }
    }
  },
  {
    path: 'graph',
    loadChildren: () => import('./views/graph/graph.module').then(m => m.GraphModule),
    data: {
      key: 'graph',
      title: 'グラフ',
      desc: 'Elextbook（エレクトブック）で回答した７日間のデータを表したグラフを見て、頑張りを確認しましょう。',
      root: {
        key: 'graph',
        index: 1
      }
    }
  },
  {
    path: 'workbook-game/:id',
    loadChildren: () => import('./views/workbook/game/game.module').then(m => m.WorkbookGameModule),
    data: {
      key: 'workbook-game',
      title: 'ワークブック',
      desc: 'Elextbook（エレクトブック）で、様々な問題を解き知識を確実にすることで資格を取得しましょう。',
      root: {
        key: 'workbook',
        index: 2
      }
    }
  },
  {
    path: 'workbook-list',
    loadChildren: () => import('./views/workbook/list/list.module').then(m => m.WorkbookListModule),
    data: {
      key: 'workbook-list',
      title: 'ワークブック',
      desc: 'Elextbook（エレクトブック）で、取得したい資格に関する適切な問題を見つけ解くことで、資格を取得しましょう。',
      root: {
        key: 'workbook',
        index: 2
      }
    }
  },
  {
    path: 'library',
    loadChildren: () => import('./views/library/library.module').then(m => m.LibraryModule),
    data: {
      key: 'library',
      title: 'ライブラリ',
      desc: 'Elextbook（エレクトブック）をより使いやすくなる様々な機能を活用し、資格を取得しましょう。',
      root: {
        key: 'library',
        index: 3
      }
    }
  },
  {
    path: 'settings',
    loadChildren: () => import('./views/settings/settings.module').then(m => m.SettingsModule),
    data: {
      key: 'settings',
      title: '設定',
      desc: 'Elextbook（エレクトブック）の設定を変更し、より効率の良い勉強ができるようにしましょう。',
      root: {
        key: 'settings',
        index: 4
      }
    }
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./views/sign-in/sign-in.module').then(m => m.SignInModule),
    data: {
      key: 'sign-in',
      title: 'サインイン',
      desc: 'Elextbook（エレクトブック）にサインインすることで、たくさんの便利な機能を利用できるようにし、効率よく勉強しましょう。',
    }
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./views/sign-up/sign-up.module').then(m => m.SignUpModule),
    data: {
      key: 'sign-up',
      title: 'アカウント作成',
      desc: 'Elextbook（エレクトブック）のアカウントを作ることで、便利な機能の利用を開始するためのステップを踏み出しましょう。',
    }
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '**',
    component: NotFoundComponent,
    data: {
      key: 'not-found',
      title: 'Not Found',
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
