import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeometryFormComponent } from './geometry-form.component';

describe('GeometryFormComponent', () => {
  let component: GeometryFormComponent;
  let fixture: ComponentFixture<GeometryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeometryFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeometryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
