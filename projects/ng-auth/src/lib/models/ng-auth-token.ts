export class NgAuthToken {
  accessToken: string = '';
  refreshToken: string = '';
  tokenType: string = '';
  expiresIn: number | undefined; // unit: second
  scope: {permissionName: string, permissionClass: string}[] = [];
  userInfo: any;
}
