import { GameCore } from '@ts/games/game';
import { StudioType } from '@ts/games/studio';

export const StudiosTypeFields: Record<StudioType, keyof GameCore> = {
  developer: 'developersIds',
  publisher: 'publishersIds'
};
