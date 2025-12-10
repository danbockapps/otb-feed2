import axios from "axios";
import { PlayerSectionsResponse } from "../types/player";

export default async function getPlayer(id: string) {
  try {
    console.time("fetchPlayerData");
    const result = await axios.get<PlayerSectionsResponse>(
      `https://ratings-api.uschess.org/api/v1/members/${id}/sections?Offset=0&Size=5`
    );

    console.timeEnd("fetchPlayerData");
    return result.data;
  } catch (error) {
    console.error("Error fetching player data:", error);
    throw error;
  }
}
