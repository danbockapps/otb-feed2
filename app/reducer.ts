import { PlayerDTO } from "./types/dto";

interface State {
  playerIds: string[];
  dtos: Record<string, PlayerDTO>;
}

export const initialState: State = {
  playerIds: ["12663913", "12659954"],
  dtos: {},
};

export const reducer = (state: State): State => {
  return state;
};
