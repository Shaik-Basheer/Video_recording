import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadScreenComponent } from './upload-screen/upload-screen.component';

const routes: Routes = [
  { path: '', component: UploadScreenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
