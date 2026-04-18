import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';


import { HeaderComponent } from "./header/header-component";
import { FooterComponent } from "./footer/footer-component";
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  imports: [RouterModule, HeaderComponent, FooterComponent, ReactiveFormsModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  schemas: []
})
export class App{
  protected title = 'host';
}
