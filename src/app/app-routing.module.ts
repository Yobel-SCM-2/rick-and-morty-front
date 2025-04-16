import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterDetailComponent } from './components/character-detail/character-detail.component';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { CharacterSearchComponent } from './components/character-search/character-search.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', component: CharacterListComponent },
  { path: 'characters', component: CharacterListComponent },
  { path: 'character/:id', component: CharacterDetailComponent },
  { path: 'search', component: CharacterSearchComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
