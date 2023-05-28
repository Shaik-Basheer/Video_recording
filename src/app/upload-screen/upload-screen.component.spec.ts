import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadScreenComponent } from './upload-screen.component';

describe('UploadScreenComponent', () => {
  let component: UploadScreenComponent;
  let fixture: ComponentFixture<UploadScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
