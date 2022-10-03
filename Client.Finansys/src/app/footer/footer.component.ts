import { Component } from "@angular/core";
import { AppService } from "../app.service";
import packageJson from '../../../package.json';


@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent {
  public version: string = packageJson.version;

  constructor(public appService: AppService) {

  }

}
