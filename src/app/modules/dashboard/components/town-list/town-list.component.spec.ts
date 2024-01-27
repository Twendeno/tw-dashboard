import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TownListComponent } from './town-list.component';

describe('TownListComponent', () => {
  let component: TownListComponent;
  let fixture: ComponentFixture<TownListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TownListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TownListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
