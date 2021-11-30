import { Component, OnInit, ViewChild } from '@angular/core';
import { EncounterService, CustomService, UtilityService, DatepickerHeaderComponent, CodeValueService, TypeList } from '@clinicaloffice/clinical-office-mpage';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'
import { Sort } from '@angular/material/sort';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-visit-history',
  templateUrl: './visit-history.component.html',
  styles: [
  ]
})
export class VisitHistoryComponent implements OnInit {
  fromDate!: Date;
  toDate!: Date;
  isReady = false;
  encounterData: any[] = new Array();
  displayedColumns: string[] = ['reg_date', 'disch_date', 'fin', 'encntr_type', 'location', 'med_service', 'attending'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild('paginator', {static: true}) paginator!: MatPaginator;
  datePickerHeader = DatepickerHeaderComponent;
  encTypeClass: any[] = new Array();
  encDefaultSet = false;

  constructor(public encounterService: EncounterService, 
              public customService: CustomService, 
              public codeValueService: CodeValueService,
              public util: UtilityService) { }

  ngOnInit(): void {
    this.fromDate = moment(this.fromDate).subtract(90, 'days').startOf('day').toDate();
    this.toDate = moment().endOf('day').toDate();

    this.dataSource.paginator = this.paginator;

    this.refreshEncounters();
  }

  // Refresh the encounter data from CCL
  refreshEncounters() {
    if (moment(this.toDate).isBefore(this.fromDate)) {
      alert('Your To Date value must be greater than the From Date. Please check your date values.');
    } else {
      this.isReady = false;                           // Set the isLoaded flag to false
      this.customService.clear('VISIT_HISTORY');      // Clear any custom visit history entries
      this.encounterData.length = 0;                  // Truncate the encounterData array
      this.dataSource.data = new Array();             // Clear the data source with a new array

      this.encounterService.loadList('1CO_MPAGE_ENC_LIST:GROUP1',
        {
          dateField: 'REG_DT_TM',
          fromDate: this.fromDate,
          toDate: this.toDate
        },
        false,
        'VISIT_HISTORY',
        this.typeList(),
        {
          encounter: {
            aliases: true,
            prsnlReltn: true
          }
        }
      );
    }
  }

  // Determine if data has been loaded
  get ready(): boolean {
    if (!this.isReady && this.customService.isLoaded('VISIT_HISTORY')) {
      // Loop through VISIT_HISTORY to populate the encounterData array
      this.customService.get('VISIT_HISTORY').visits.forEach((e: any) => {
        const enc = this.encounterService.get(e.encntrId);  // Retrieve the encounter
        this.encounterData.push(
          {
            regDtTm: enc.regDtTm,
            dischDtTm: enc.dischDtTm,
            fin: this.encounterService.getAlias('FIN NBR', e.encntrId).aliasFormatted,
            encntrTypeClass: enc.encntrTypeClass,
            encntrType: enc.encntrType,
            location: enc.locFacility + ' ' + enc.locNurseUnit,
            medService: enc.medService,
            attending: this.encounterService.getPrsnlReltn('ATTENDDOC', e.encntrId).nameFullFormatted
          }
        );
      });

      this.dataSource.data = this.encounterData;
      this.isReady = true;
    }

    // Update the default encounter type checkbox
    if (!this.encDefaultSet && this.codeValueService.getCodeSet(69).length > 0) {
      
      this.encTypeClass.push(this.codeValueService.getCodeSet(69).filter((cv: any) => {
        return cv.displayKey === 'INPATIENT';
      })[0].codeValue);

      this.encDefaultSet = true;
    }

    return this.isReady;
  }

  // Sort table
  sortData(sort: Sort) {
    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'reg_date': return this.util.compare(a.regDtTm, b.regDtTm, isAsc);
        case 'disch_date': return this.util.compare(a.dischDtTm, b.dischDtTm, isAsc);
        case 'fin': return this.util.compare(a.fin, b.fin, isAsc);
        case 'encntr_type': return this.util.compare(a.encntrType, b.encntrType, isAsc);
        case 'location': return this.util.compare(a.location, b.location, isAsc);
        case 'med_service': return this.util.compare(a.medService, b.medService, isAsc);
        case 'attending': return this.util.compare(a.attending, b.attending, isAsc);
        default:
          return 0;
      }
    });
  }

  // Set the date from a prompt
  setDate(dateField: string, event: MatDatepickerInputEvent<any>) {
    if (dateField === 'FROM') {
      this.fromDate = event.value;
    } else {
      this.toDate = event.value;
    }
  }

  // Returns typelist values or default
  typeList(): TypeList[] {
    const tl: TypeList[] = new Array();
    if (this.encTypeClass.length > 0) {
      this.encTypeClass.forEach((e: any) => {
        tl.push({codeSet: 69, type: '', typeCd: e});
      });
      return tl;
    } 
    return [{codeSet: 69, type: 'INPATIENT', typeCd: 0}];
  }

}
