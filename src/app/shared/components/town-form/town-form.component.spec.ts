import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TownFormComponent } from './town-form.component';

describe('TownFormComponent', () => {
  let component: TownFormComponent;
  let fixture: ComponentFixture<TownFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TownFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TownFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
