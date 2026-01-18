export interface RawgPlatform {
  id: number;
  name: string;
  slug: string;
}

export interface PlatformRelease {
  platform: RawgPlatform;
  released_at: string;
}
