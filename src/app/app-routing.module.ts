import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllergiesComponent } from './allergies/allergies.component';
import { ProblemsDiagnosisComponent } from './problems-diagnosis/problems-diagnosis.component';
import { VisitHistoryComponent } from './visit-history/visit-history.component';
import { AppointmentHistoryComponent } from './appointment-history/appointment-history.component';

const routes: Routes = [
  { path: 'allergies', component: AllergiesComponent },
  { path: 'problemsdiagnosis', component: ProblemsDiagnosisComponent},
  { path: 'visithistory', component: VisitHistoryComponent },
  { path: 'appointmenthistory', component: AppointmentHistoryComponent },
  { path: '**', redirectTo: 'allergies' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
