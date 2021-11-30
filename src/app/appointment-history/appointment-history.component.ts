import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomService, UtilityService, DatepickerHeaderComponent } from '@clinicaloffice/clinical-office-mpage';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'
import { Sort } from '@angular/material/sort';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-appointment-history',
  templateUrl: './appointment-history.component.html',
  styles: [
  ]
})
export class AppointmentHistoryComponent implements OnInit {
  fromDate!: Date;
  toDate!: Date;
  isReady = false;
  displayedColumns: string[] = ['beg_dt_tm', 'appt_type', 'resource', 'location', 'sch_state'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild('paginator', { static: true }) paginator!: MatPaginator;
  datePickerHeader = DatepickerHeaderComponent;

  constructor(public customService: CustomService, public util: UtilityService) { }

  ngOnInit(): void {
    this.fromDate = moment(this.fromDate).subtract(90, 'days').startOf('day').toDate();
    this.toDate = moment().endOf('day').toDate();

    this.dataSource.paginator = this.paginator;

    this.refreshAppointments();
  }

  // Refresh the appointment data from CCL
  refreshAppointments() {
    if (moment(this.toDate).isBefore(this.fromDate)) {
      alert('Your To date value must be greater than the From date. Please check your date values.');
    } else {
      this.customService.clear('APPOINTMENT_HISTORY');
      this.isReady = false;

      this.customService.load(
        {
          customScript: {
            script: [
              {
                name: '1trn_train_appt_hist:group1',
                run: 'pre',
                id: 'APPOINTMENT_HISTORY',
                parameters: {
                  fromDate: this.fromDate,
                  toDate: this.toDate
                }
              }
            ],
            clearPatientSource: false
          }
        }
      );
    }
  }

  // Determine if data has been loaded
  get ready(): boolean {
    // Determine if custom data loaded
    if (!this.isReady && this.customService.isLoaded('APPOINTMENT_HISTORY')) {
      // Copy custom data directly to appointmentDS.data
      this.dataSource.data = this.customService.get('APPOINTMENT_HISTORY').appointments;

      this.isReady = true;
    }
    return this.isReady;
  }

  // Sort table
  sortData(sort: Sort) {
    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'beg_dt_tm':
          return this.util.compare(a.begDtTm, b.begDtTm, isAsc);
        case 'appt_type':
          return this.util.compare(a.apptType, b.apptType, isAsc);
        case 'resource':
          return this.util.compare(a.resource, b.resource, isAsc);
        case 'location':
          return this.util.compare(a.location, b.location, isAsc);
        case 'sch_state':
          return this.util.compare(a.schState, b.schState, isAsc);
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

}
