export class NgPrincipal {
  [key: string]: any;

  addProperty(data: any): void {
    Object.assign(this, data);
  }

  getProperty(key: any): any {
    return this[key];
  }

}
