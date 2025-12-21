export default interface Token {
  id: string;
  expiresAt: string;
}

export interface TokenPack {
  access: string;
  refresh: string;
  update: boolean;
}
