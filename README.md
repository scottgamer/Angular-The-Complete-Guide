# Angular The Complete Guide

This is a test app to summarize the main concepts behind Angular

## Installation

- `npm i -g @angular/cli`
- Requires node.js 12

---

## Commands

- ng new [project-name], create new Angular project
- ng serve, start development server
- ng generate component [component-name], create new component

---

## Dynamic Data

### String Interpolation

- Outputs data as text in a template

```html
<p>{{ "Server" }} with ID {{ serverId }} is {{ getServerStatus() }}</p>
```

### Property Binding

- Binds elements properties with class properties
- Changes html properties

```typescript
allowNewServer = false;


  constructor() {
    setTimeout(()=>{
      this.allowNewServer = true;
    }, 2000);
  }
```

```html
<button class="btn btn-primary" [disabled]="!allowNewServer">Add Server</button>
```

### Event Binding

- Binds javascript code to an event `import { FormsModule } from '@angular/forms'`;

```html
<button (click)="onCreateServer()">
  Add Server
</button>
```

```typescript
onCreateServer() {
    this.serverCreationStatus = "Server was created";
  }
```

- Using inputs

```typescript
  onUpdateServerName(event: Event) {
    this.serverName = (<HTMLInputElement>event.target).value;
  }
```

```html
<input type="text" class="form-control" (input)="onUpdateServerName($event)" />
<p>{{ serverName }}</p>
```

### Two-way Data Binding

- Allows changing data in both directions html > typescript, typescript > html

- First, enable the `ngModel` directive by adding `FormsModule` to `imports[] in the AppModule`

```typescript
import { FormsModule } from "@angular/forms";
```

```html
<input type="text" class="form-control" [(ngModel)]="serverName" />
<p>{{ serverName }}</p>
```

---

## Directives

- Instructions in the DOM
- Can be used as element attributes

### Attribute Directives

- Look like a normal HTML attribute (possibly with data bindings or event bindings)
- Only affect/change the element they are added to

### Structural Directives

- Look like a normal HTML attribute, but have a leading \* (for desugaring)
- Affect a whole area in the DOM (elements get added/removed)

### NgIf

- Displays an element if a condition is met
- It's an structural directive

```html
<p *ngIf="serverCreated">Server was created, server name is {{ serverName }}</p>
```

```typescript
this.serverCreated = false;

onCreateServer() {
    this.serverCreated = true;
    this.serverCreationStatus = `Server was created! Name is ${this.serverName}`;
  }
```

- It is possible to use if-else

```html
<p *ngIf="serverCreated; else noServer">
  Server was created, server name is {{ serverName }}
</p>
<ng-template #noServer><p>No server was created</p></ng-template>
```

### NgSwitch

- Works as a switch-case statement

```html
<div [ngSwitch]="value">
  <p *ngSwitchCase="5">Value is 5</p>
  <p *ngSwitchCase="10">Value is 10</p>
  <p *ngSwitchCase="100">Value is 100</p>
  <p *ngSwitchDefault>Value is Default</p>
</div>
```

### NgStyle

- Allows to dynamically assign an style
- It's an attribute directive
- Can be bound to element attributes

```html
<p [ngStyle]="{color: getColor()}">
  {{ "Server" }} with ID {{ serverId }} is {{ getServerStatus() }}
</p>
```

```typescript
getColor() {
    return this.serverStatus === "online" ? "green" : "red";
  }
```

### NgClass

- Allows to dynamically add or remove classes

```html
<p
  [ngStyle]="{ color: getColor() }"
  [ngClass]="{ online: serverStatus === 'online' }"
>
  {{ "Server" }} with ID {{ serverId }} is {{ getServerStatus() }}
</p>
```

```typescript
@Component({
  styles: [
    `
      .online {
        color: white;
      }
    `
  ]
})
export class ServerComponent {
  serverStatus: string = "offline";

  constructor() {
    this.serverStatus = Math.random() > 0.5 ? "online" : "offline";
  }
}
```

---

## Life cycle Methods

- ngOnChanges: called after a bound input property changes
- ngOnInit: called once the component is initialized
- ngDoCheck: called during every change detection run
- ngAfterContentInit: called after content (ng-content) has been projected into view
- ngAfterContentChecked: called every time the projected content has been checked
- ngAfterViewInit: called after the component's view (and child views) has been initialized
- ngAfterViewChecked: called every time the view (and child views) have been checked
- ngOnDestroy: called once the component is about to be destroyed

---

```html
<!-- parent recipe-list.component passing data to child recipe.component -->
<app-recipe-item
  *ngFor="let recipe of recipes"
  [recipe]="recipe"
></app-recipe-item>
```

```typescript
// receive data as @Input decorator
...
@Input() recipe: Recipe;
```

---

## Services & Dependency Injection

### Hierarchical Injector

- Instead of instantiating classes, allows working with abstractions
- Passing contracts to the constructor

- AppModule: Same instance of service is available Application-wide
- AppComponent: Same instance of Service is available for all Components (but not for other Services)
- Any other Component: Same instance of Service is available for the Component and all its child components

- \* Remember to always use the parent instance of a service instead of using multiple instances to avoid buggy effects

### @Injectable

- Use @Injectable when you need to inject a service into another service (injects meta-data)

```typescript
// The service that will be injected
import { LoggingService } from "./logging.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AccountsService {
  accounts = [...];

  constructor(private loggingService: LoggingService) {}

  addAccount(name: string, status: string) {
    ...
    this.loggingService.logStatusChange(status);
  }

  updateSTatus(id: number, status: string) {
    ...
    this.loggingService.logStatusChange(status);
  }
}

```

```typescript
export class LoggingService {
  logStatusChange(status: string) {
    console.log(`A server status changed, new status: ${status}`);
  }
}
```

```typescript
import { LoggingService } from "../logging.service";

@Component({
  ...
  providers: [LoggingService]
})
export class NewAccountComponent {
  constructor(private loggingService: LoggingService) {}

  onCreateAccount(accountName: string, accountStatus: string) {
    ...
    this.loggingService.logStatusChange(accountStatus);
    ...
  }
}

```

---

## Routing

- Angular provides a module to handle routing

```typescript
...
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { UsersComponent } from "./users/users.component";

const appRoutes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "users",
    component: UsersComponent
  },
  ...
];

@NgModule({
  declarations: [
    HomeComponent,
    UsersComponent
  ],
  imports: [..., RouterModule.forRoot(appRoutes)],
  ...
})
export class AppModule {}

```

```html
<div class="container">
  <div class="row">
    <ul class="nav nav-tabs">
      <li role="presentation" class="active"><a routerLink="/">Home</a></li>
      <li role="presentation"><a routerLink="/servers">Servers</a></li>
      <!-- allows adding more segments in the path -->
      <li role="presentation"><a [routerLink]="['/users']">Users</a></li>
    </ul>
  </div>
  <div class="row">
    <router-outlet></router-outlet>
  </div>
</div>
```

### Passing Parameters

```typescript
  const appRoutes: Routes = [
    {
      path: "users/:id/:name",
      component: UserComponent
    },
  ...
  ];
```

### Styling Links

- It's possible to use angular directives to style router links

```html
<ul class="nav nav-tabs">
  <li
    role="presentation"
    routerLinkActive="active"
    [routerLinkActiveOptions]="{ exact: true }"
  >
    <a routerLink="/">Home</a>
  </li>
  <li role="presentation" routerLinkActive="active">
    <a routerLink="/servers">Servers</a>
  </li>
  <li role="presentation" routerLinkActive="active">
    <a [routerLink]="['/users']">Users</a>
  </li>
</ul>
```

### Routing Programmatically

```html
<button class="btn btn-primary" (click)="onLoadServers()">Load Servers</button>
```

```typescript
import { Router } from "@angular/router";

onLoadServers() {
    this.router.navigate(["/servers"]);
  }
}
```

### Changing parameters using Subscriptions

```html
<a [routerLink]="['/users', 10, 'Anna']">Load Anna</a>
```

```typescript
export class UserComponent implements OnInit {
  user: { id: number; name: string };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // First load
    this.user = {
      id: this.route.snapshot.params["id"],
      name: this.route.snapshot.params["name"]
    };
    // Subsequent loads, possibly changing params
    this.route.params.subscribe((params: Params) => {
      this.user.id = params["id"];
      this.user.name = params["name"];
    });
  }
}
```

---

This project was generated with Angular CLI version 9.0.4.

# Development server

Run ng serve for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

# Code scaffolding

Run ng generate component component-name to generate a new component. You can also use ng generate directive|pipe|service|class|guard|interface|enum|module.

# Build

Run ng build to build the project. The build artifacts will be stored in the dist/ directory. Use the --prod flag for a production build.

# Running unit tests

Run ng test to execute the unit tests via Karma.

# Running end-to-end tests

Run ng e2e to execute the end-to-end tests via Protractor.
