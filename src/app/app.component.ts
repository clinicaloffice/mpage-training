import {Component, OnInit} from '@angular/core';
import {mPageService, CodeValueService} from "@clinicaloffice/clinical-office-mpage";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navLinks = [
    {label: 'Allergies', link: '/allergies', index: 0},
    {label: 'Problems & Diagnosis', link: '/problemsdiagnosis', index: 1},
    {label: 'Visit History', link: '/visithistory', index: 2},
    {label: 'Appointment History', link: '/appointmenthistory', index: 3}
  ];

  constructor(public mPage: mPageService, public codeValueService: CodeValueService) {
  }

  ngOnInit(): void {
    // Proxy server settings
    this.mPage.enableProxy = true;
    this.mPage.contextRoot = 'discern/b0783.phsa_cd.cerncd.com/mpages/reports/1co3_mpage_entry:group1';

    // Initialize MPage services with 2 queues, allow debugging and set to chart level
    this.mPage.setMaxInstances(2, true, 'CHART');

    // Load code set 69
    this.codeValueService.load(69);

  }

}
