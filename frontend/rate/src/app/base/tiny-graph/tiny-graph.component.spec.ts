import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TinyGraphComponent } from './tiny-graph.component';

describe('TinyGraphComponent', () => {
  let component: TinyGraphComponent;
  let fixture: ComponentFixture<TinyGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TinyGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TinyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
