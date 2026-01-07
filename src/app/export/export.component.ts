import { Component, inject } from "@angular/core";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import {} from "@angular/core";
import { BeanServiceService } from "../bean-service.service";
import { OmniscientTransaction } from "../transaction";
import { JsonPipe } from "@angular/common";
import { StatusControlService } from "../status-control.service";
import { LedgerViewComponent } from "../ledger-view/ledger-view.component";

@Component({
  selector: "app-export",
  imports: [JsonPipe, LedgerViewComponent],
  templateUrl: "./export.component.html",
  styleUrl: "./export.component.css",
})
export class ExportComponent {
  private beanService = inject(BeanServiceService);
  private statusControl = inject(StatusControlService);
  fullHistory: OmniscientTransaction[] | null = null;
  // exportStatus: string = 'Loading';
  lastSaved: Date | null = null;
  permissioned: boolean = false;

  constructor() {}

  ngOnInit() {
    console.log("In oninit of export");
    this.getLastSavedDate();

    this.fullHistory = this.beanService.ledger.ledgerData;
    if (this.fullHistory.length == 0) {
      this.statusControl.addStatus("no history items could be loaded");
      this.statusControl;
    } else {
      this.statusControl.addStatus("saving data");
      this.saveFile().then(
        () => {
          this.statusControl.addPriorityStatus("Data saved");
        },
        (err) => {
          this.statusControl.addPriorityStatus(`ERROR: saving failed\n${err}`);
        },
      );
    }
  }

  getLastSavedDate() {
    const storedDate = localStorage.getItem("exportDate");
    if (storedDate) {
      // should update automatically with angular string template
      this.lastSaved = new Date(JSON.parse(storedDate));
    }
  }

  storeLastSavedDate() {
    localStorage.setItem("exportDate", JSON.stringify(this.lastSaved));
  }

  async saveFile() {
    console.log("Saving file. Does this even trigger in browser vbiew?");

    // const platform = this.getPlatform();

    this.permissioned = await this.permissionit();
    console.log(`permission status is ${this.permissioned}`);
    if (this.permissioned) {
      try {
        const filedata = JSON.stringify(this.fullHistory);
        const fname = `brokeAndCold_export-${new Date(Date.now()).toDateString()}.json`;

        const writeResult = await Filesystem.writeFile({
          path: fname,
          data: filedata,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
        });

        this.statusControl.addStatus(`File save of ${fname} SUCCESS!`);
        console.log(
          `seems the file was saved successfuly to ${writeResult.uri}`,
        );
        this.lastSaved = new Date();
        this.storeLastSavedDate();
      } catch (e) {
        this.statusControl.addStatus(`File save FAILED! See console log`);
        console.log(`File error: ${e}`);
      }
    } else {
      this.statusControl.addStatus("Need them permissions");
    }
  }

  getPlatform(): string {
    console.log("platform using:");
    let detectedPlatform: string = "unknown";
    if (typeof window !== "undefined" && (window as any).Capacitor) {
      detectedPlatform = (window as any).Capacitor.getPlatform();
      if (detectedPlatform === "web") {
        // If it's 'web', try to differentiate browser types based on user agent
        if (/(android)/i.test(navigator.userAgent)) {
          detectedPlatform = "web-android-browser";
        } else if (/(iphone|ipad|ipod)/i.test(navigator.userAgent)) {
          detectedPlatform = "web-ios-browser";
        } else if (
          /(macintosh|windows|linux|cros)/i.test(navigator.userAgent)
        ) {
          detectedPlatform = "web-desktop-browser";
        } else {
          detectedPlatform = "web-browser"; // Generic web browser
        }
      }
    } else {
      // Fallback for non-Capacitor environments (e.g., pure web app), relying on user agent
      if (/(android)/i.test(navigator.userAgent)) {
        detectedPlatform = "android-browser";
      } else if (/(iphone|ipad|ipod)/i.test(navigator.userAgent)) {
        detectedPlatform = "ios-browser";
      } else if (/(macintosh|windows|linux|cros)/i.test(navigator.userAgent)) {
        detectedPlatform = "desktop-browser";
      } else {
        detectedPlatform = "unknown-browser"; // Catch-all for other web environments
      }
    }
    console.log(detectedPlatform);
    return detectedPlatform;
  }

  async loadFile() {
    throw "Not implememnted";
  }

  async clearFile() {
    localStorage.clear()
  }

  async permissionit(): Promise<boolean> {
    console.log("getsing da permissions");
    const allowed = await Filesystem.checkPermissions();
    // let perms = Permisionstatus.

    if (allowed.publicStorage !== "granted") {
      Filesystem.requestPermissions()
        .then((res) => {
          if (res.publicStorage !== "granted") {
            this.statusControl.addPriorityStatus(
              "You gotta give permissions dude",
            );
            return true;
          } else return false;
        })
        .catch((rej) => {
          this.statusControl.addPriorityStatus("Aint got permissions");
          this.statusControl.addStatus("You gotta give permissions man");
          return false;
        });
    } else {
      return true;
    }

    return false;
  }
}
