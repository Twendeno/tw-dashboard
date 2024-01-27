import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoCalculComponent } from './geo-calcul.component';

describe('GeoCalculComponent', () => {
  let component: GeoCalculComponent;
  let fixture: ComponentFixture<GeoCalculComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeoCalculComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeoCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
