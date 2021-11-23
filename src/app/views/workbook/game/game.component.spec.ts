import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkbookGameComponent } from './game.component';

describe('WorkbookGameComponent', () => {
  let component: WorkbookGameComponent;
  let fixture: ComponentFixture<WorkbookGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkbookGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkbookGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
