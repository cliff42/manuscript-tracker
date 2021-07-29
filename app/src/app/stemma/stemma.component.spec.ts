import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StemmaComponent } from './stemma.component';

describe('StemmaComponent', () => {
  let component: StemmaComponent;
  let fixture: ComponentFixture<StemmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StemmaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StemmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
