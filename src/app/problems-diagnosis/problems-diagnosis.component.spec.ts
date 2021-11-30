import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemsDiagnosisComponent } from './problems-diagnosis.component';

describe('ProblemsDiagnosisComponent', () => {
  let component: ProblemsDiagnosisComponent;
  let fixture: ComponentFixture<ProblemsDiagnosisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemsDiagnosisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemsDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
