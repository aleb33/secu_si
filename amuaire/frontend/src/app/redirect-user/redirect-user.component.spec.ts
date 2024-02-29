import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectUserComponent } from './redirect-user.component';

describe('RedirectUserComponent', () => {
  let component: RedirectUserComponent;
  let fixture: ComponentFixture<RedirectUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirectUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RedirectUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
