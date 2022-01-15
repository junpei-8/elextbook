import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkbookQuizComponent } from './quiz.component';

describe('WorkbookQuizComponent', () => {
  let component: WorkbookQuizComponent;
  let fixture: ComponentFixture<WorkbookQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkbookQuizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkbookQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
