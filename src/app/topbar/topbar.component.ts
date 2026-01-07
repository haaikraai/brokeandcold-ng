import { Component, contentChild, inject, TemplateRef, viewChildren } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
// import { BeanServiceService } from '../bean-service.service';
import { StatusControlService } from "../status-control.service";
import { NgTemplateOutlet } from "../../../node_modules/.pnpm/@angular+common@19.0.5_@ang_44f05e83e13dc4e0b7938b004323bc3f/node_modules/@angular/common/index";

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrl: "./topbar.component.css",
  imports: [NgTemplateOutlet],
})
export class TopbarComponent {
  private router = inject(Router);
  statusControl = inject(StatusControlService);
  availableButtons = viewChildren('ng-template', {read: TemplateRef})
  leftButton = 

  constructor() {}

  gotoSettings() {
    console.log("let us go tof settings!!!!");
    this.router.navigate(["settings"]);
  }

  gotoHistory() {
    // This is now the export data function:
    console.log("EWxport history");
    this.router.navigate(["export"]);
    // this.router.navigate( ['/history']);
  }
}
