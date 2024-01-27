import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonLinterComponent } from './json-linter.component';

describe('JsonLinterComponent', () => {
  let component: JsonLinterComponent;
  let fixture: ComponentFixture<JsonLinterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonLinterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JsonLinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
