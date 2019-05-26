import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-page-not-found",
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col px-0">
          <div class="alert alert-danger text-center">Page Not Found.</div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./page-not-found.component.scss"]
})
export class PageNotFoundComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
