"use server";

import axios from "axios";
import { PlayerDTO } from "../types/dto";
import { Player, PlayerSectionsResponse } from "../types/uschess";

export default async function getPlayer(id: string): Promise<PlayerDTO> {
  try {
    const result = await Promise.allSettled([
      axios.get<Player>(`https://ratings-api.uschess.org/api/v1/members/${id}`),
      axios.get<PlayerSectionsResponse>(
        `https://ratings-api.uschess.org/api/v1/members/${id}/sections?Offset=0&Size=5`
      ),
    ]);

    if (result[0].status === "fulfilled" && result[1].status === "fulfilled") {
      const playerData = result[0].value.data;
      const sectionsData = result[1].value.data;

      return {
        firstName: playerData.firstName,
        lastName: playerData.lastName,
        events: sectionsData.items.map((section) => ({
          eventId: section.event.id,
          eventName: section.event.name,
          sectionId: section.id,
          sectionName: section.sectionName,
          sectionNumber: section.sectionNumber,
          ratingRecords: section.ratingRecords.map((record) => ({
            preRating: record.preRating,
            postRating: record.postRating,
            ratingSource: record.ratingSource,
          })),
        })),
      };
    } else {
      throw new Error("Failed to fetch player data");
    }
  } catch (error) {
    console.error("Error fetching player data:", error);
    throw error;
  }
}

// https://ratings-api.uschess.org/api/v1/members/12663913/sections?Offset=0&Size=5
// https://ratings-api.uschess.org/api/v1/members/12663913
