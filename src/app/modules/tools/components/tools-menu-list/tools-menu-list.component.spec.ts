import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsMenuListComponent } from './tools-menu-list.component';

describe('ToolsMenuListComponent', () => {
  let component: ToolsMenuListComponent;
  let fixture: ComponentFixture<ToolsMenuListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolsMenuListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToolsMenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
