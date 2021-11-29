import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ClinicalOfficeMpageModule, DiagnosisService } from "@clinicaloffice/clinical-office-mpage";
import { MaterialModule } from "@clinicaloffice/clinical-office-mpage";
import { ErrorHandlerService } from "@clinicaloffice/clinical-office-mpage";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FlexLayoutModule } from "@angular/flex-layout";
import { DemographicsComponent } from './demographics/demographics.component';
import { AllergiesComponent } from './allergies/allergies.component';
import { ProblemsComponent } from './problems/problems.component';
import { DiagnosisComponent } from './diagnosis/diagnosis.component';

@NgModule({
  declarations: [
    AppComponent,
    DemographicsComponent,
    AllergiesComponent,
    ProblemsComponent,
    DiagnosisComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    ClinicalOfficeMpageModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatMomentDateModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {
      provide: MAT_DATE_FORMATS, useValue: {
        parse: {
          dateInput: ['l', 'LL'],
        },
        display: {
          dateInput: 'MM-DD-YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
