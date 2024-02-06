import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDataNotFoundComponent } from './table-data-not-found.component';

describe('TableDataNotFoundComponent', () => {
  let component: TableDataNotFoundComponent;
  let fixture: ComponentFixture<TableDataNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableDataNotFoundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableDataNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
