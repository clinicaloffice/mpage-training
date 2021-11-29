import { Component, OnInit, ViewChild } from '@angular/core';
import { DiagnosisService, IDiagnosis } from '@clinicaloffice/clinical-office-mpage';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'
import { Sort } from '@angular/material/sort';
import { UtilityService } from '@clinicaloffice/clinical-office-mpage';

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styles: [
  ]
})
export class DiagnosisComponent implements OnInit {
  isReady = false;
  displayedColumns: string[] = ['diag_date', 'diagnosis', 'diagnosis_identifier'];
  dataSource: MatTableDataSource<IDiagnosis> = new MatTableDataSource();
  @ViewChild('paginator', {static: true}) paginator!: MatPaginator;

  constructor(public diagnosisService: DiagnosisService, public util: UtilityService) { }

  ngOnInit(): void {
    this.diagnosisService.load('DIAGNOSIS_ALL');
    this.dataSource.paginator = this.paginator;
  }

  // Determine if data has loaded and assign to data source
  get ready(): boolean {
    if (!this.isReady) {
      if (this.diagnosisService.get()[0].diagnosisId > 0) {
        this.isReady = true;
        this.dataSource.data = this.diagnosisService.get();
      }
    }
    return this.isReady;    
  }

  sortData(sort: Sort) {
    this.dataSource.data = this.dataSource.data.sort((a: IDiagnosis, b: IDiagnosis) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'diag_date': return this.util.compare(a.diagDtTm, b.diagDtTm, isAsc);
        case 'diagnosis': return this.util.compare(a.dxSourceString, b.dxSourceString, isAsc);
        case 'diagnosis_identifier': return this.util.compare(a.dxSourceIdentifier, b.dxSourceIdentifier, isAsc);
        default:
          return 0;
      }
    });
  }


}
