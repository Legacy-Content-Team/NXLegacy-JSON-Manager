export interface GameLink {
  [key: string]: {
    url: string;
    type: 'nsp' | 'xci' | 'nsz' | 'xcz';
  };
}

export interface Update {
  id: string;
  version: string;
  links: GameLink;
  addedDate: string;
}

export interface DLC {
  id: string;
  version: string;
  links: GameLink;
  addedDate: string;
}

export interface GameData {
  base: {
    id: string;
    version: number;
    links: GameLink;
    addedDate: string;
  };
  dlc_pack?: {
    links: GameLink;
    addedDate: string;
  };
  updates: Update[];
  dlcs: DLC[];
}