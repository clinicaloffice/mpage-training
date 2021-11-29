import { Component, OnInit, ViewChild } from '@angular/core';
import { AllergyService, IAllergy } from '@clinicaloffice/clinical-office-mpage';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'
import { Sort } from '@angular/material/sort';
import { UtilityService } from '@clinicaloffice/clinical-office-mpage';

@Component({
  selector: 'app-allergies',
  templateUrl: './allergies.component.html'
})
export class AllergiesComponent implements OnInit {
  isReady = false;
  displayedColumns: string[] = ['substance_type', 'substance', 'substance_identifier'];
  dataSource: MatTableDataSource<IAllergy> = new MatTableDataSource();
  @ViewChild('paginator', {static: true}) paginator!: MatPaginator;

  // Filter variables
  drugFilter = true;
  envFilter = false;
  foodFilter = false;
  otherFilter = false;

  constructor(public allergyService: AllergyService, public util: UtilityService) { }

  ngOnInit(): void {
    this.allergyService.load();
    this.dataSource.paginator = this.paginator;
  }

  // Determine if data has loaded and assign to data source
  get ready(): boolean {
    if (!this.isReady) {
      if (this.allergyService.get()[0].allergyId > 0) {
        this.isReady = true;
        this.refreshDataSource();
      }
    }
    return this.isReady;    
  }

  // Refresh the data source
  refreshDataSource() {
    if (this.isReady) {
      this.dataSource.data = this.allergyService.get().filter((e: IAllergy) => {
        return (
          (e.substanceType === 'Drug' && this.drugFilter) ||
          (e.substanceType === 'Environment' && this.envFilter) ||
          (e.substanceType === 'Food' && this.foodFilter) ||
          (e.substanceType === 'Other' && this.otherFilter)
        )
      });
    }
  }

  // Sort the table
  sortData(sort: Sort) {
    this.dataSource.data = this.dataSource.data.sort((a: IAllergy, b: IAllergy) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'substance_type': return this.util.compare(a.substanceType, b.substanceType, isAsc);
        case 'substance': return this.util.compare(a.substance.toUpperCase, b.substance.toUpperCase, isAsc);
        case 'substance_identifier': return this.util.compare(a.substanceIdentifier, b.substanceIdentifier, isAsc);
        default:
          return 0;
      }
    });
  }

}
