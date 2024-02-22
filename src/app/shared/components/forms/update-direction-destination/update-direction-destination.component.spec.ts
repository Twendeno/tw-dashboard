import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDirectionDestinationComponent } from './update-direction-destination.component';

describe('UpdateDirectionDestinationComponent', () => {
  let component: UpdateDirectionDestinationComponent;
  let fixture: ComponentFixture<UpdateDirectionDestinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDirectionDestinationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateDirectionDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
