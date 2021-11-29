import { Component, OnInit, ViewChild } from '@angular/core';
import { ProblemService, IProblem } from '@clinicaloffice/clinical-office-mpage';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'
import { Sort } from '@angular/material/sort';
import { UtilityService } from '@clinicaloffice/clinical-office-mpage';

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styles: [
  ]
})
export class ProblemsComponent implements OnInit {
  isReady = false;
  displayedColumns: string[] = ['onset_date', 'problem', 'problem_identifier'];
  dataSource: MatTableDataSource<IProblem> = new MatTableDataSource();
  @ViewChild('paginator', {static: true}) paginator!: MatPaginator;

  constructor(public problemService: ProblemService, public util: UtilityService) { }

  ngOnInit(): void {
    this.problemService.load();
    this.dataSource.paginator = this.paginator;
  }

  // Determine if data has loaded and assign to data source
  get ready(): boolean {
    if (!this.isReady) {
      if (this.problemService.get()[0].problemId > 0) {
        this.isReady = true;
        this.dataSource.data = this.problemService.get();
      }
    }
    return this.isReady;    
  }

  sortData(sort: Sort) {
    this.dataSource.data = this.dataSource.data.sort((a: IProblem, b: IProblem) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'onset_date': return this.util.compare(a.onsetDtTm, b.onsetDtTm, isAsc);
        case 'problem': return this.util.compare(a.probSourceString, b.probSourceString, isAsc);
        case 'problem_identifier': return this.util.compare(a.probSourceIdentifier, b.probSourceIdentifier, isAsc);
        default:
          return 0;
      }
    });
  }

}
