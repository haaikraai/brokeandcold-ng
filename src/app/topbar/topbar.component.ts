import { Component, computed, inject, signal, TemplateRef, ViewChild, AfterViewInit, effect } from "@angular/core";
import { Router } from "@angular/router";
// import { BeanServiceService } from '../bean-service.service';
import { StatusControlService } from "../status-control.service";
import { NgTemplateOutlet } from "@angular/common";


// type availableButtons = "Back" | "Settings";

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrl: "./topbar.component.css",
  imports: [NgTemplateOutlet],
})
export class TopbarComponent implements AfterViewInit {
  private router = inject(Router);
  statusControl = inject(StatusControlService);

  // signals that will hold the template refs once they are available
  private settingsBtnTemplate = signal<TemplateRef<any> | null>(null);
  private backBtnTemplate = signal<TemplateRef<any> | null>(null);

  // ViewChild setters update the above signals when Angular resolves the templates
  @ViewChild('settingsButton', { read: TemplateRef })
  set settingsTpl(t: TemplateRef<any> | null) {
    this.settingsBtnTemplate.set(t);
  }

  @ViewChild('backButton', { read: TemplateRef })
  set backTpl(t: TemplateRef<any> | null) {
    this.backBtnTemplate.set(t);
  }

  // computed slot depends on the active button and both template signals
  leftButtonSlot = computed<TemplateRef<any> | null>(() => {
    const settings = this.settingsBtnTemplate();
    const back     = this.backBtnTemplate();
    return this.statusControl.activeLeftBtn() === "Settings" ? settings : back;
  });
  
  constructor() {
    // when activeLeftBtn changes we recalc the slot; effect depends on the computed
    effect(() => this.leftButtonSlot());
  }

  ngAfterViewInit() {
    // force evaluation once view children are ready to avoid blank rendering
    this.leftButtonSlot();
  }

  ngOnint() {
  }


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

  gotoBack() {
    console.log("let us go back!!!!");
    this.router.navigate(["/"]);
  }
}
