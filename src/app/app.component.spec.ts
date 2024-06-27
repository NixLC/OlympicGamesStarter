import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {HttpClientModule, provideHttpClient} from "@angular/common/http";
import {provideRouter, RouterOutlet} from "@angular/router";
import {HomeComponent} from "./pages/home/home.component";


describe('AppComponent', () => {

  beforeEach(async () => {
    let router = {navigate: jasmine.createSpy('navigate')};
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HttpClientModule,
        RouterOutlet
      ],
      providers: [
        provideHttpClient(),
        provideRouter([{path: '', component: HomeComponent}])
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'olympic-games-starter'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('olympic-games-starter');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.footer span')?.textContent).toContain('olympic-games-starter app is running !');
  });
});
