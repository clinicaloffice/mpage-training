import { Component, OnInit } from '@angular/core';
import { PersonService } from '@clinicaloffice/clinical-office-mpage';

@Component({
  selector: 'app-demographics',
  templateUrl: './demographics.component.html'
})
export class DemographicsComponent implements OnInit {
  
  constructor(public personService: PersonService) { }

  ngOnInit(): void {
    this.personService.load('PERSON_PATIENT');
  }

}