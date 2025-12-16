import { IPerformance, PartialEventInfo, PerformanceSection } from '../types/types'

interface EventDisplayProps {
  event: PartialEventInfo
  performances: IPerformance[]
}

export default function EventDisplay({ event, performances }: EventDisplayProps) {
  // Calculate total players
  const totalPlayers = performances.reduce((sum, section) => sum + section.ratingRecords.length, 0)

  // Sort sections by sectionNumber ascending
  const sections = performances.reduce<PerformanceSection[]>(
    (acc, cur) =>
      acc.some((item) => item.sectionNumber === cur.sectionItem.sectionNumber)
        ? acc
        : [...acc, cur.sectionItem],
    [],
  )

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        {/* Header */}
        <div className="mb-4">
          <h2 className="card-title text-2xl">{event.name}</h2>
          <p className="text-sm text-gray-500">End Date: {event.endDate}</p>
          <p className="text-lg font-semibold mt-2">
            {totalPlayers} players played in {event.name}
          </p>
        </div>

        {/* Sections */}
        {sections.length === 0 ? (
          <div className="alert alert-info">
            <span>No sections available for this event.</span>
          </div>
        ) : (
          <div className="space-y-6">
            {sections.map((section, i) => {
              const players = performances.filter(
                (perf) => perf.sectionItem.sectionNumber === section.sectionNumber,
              )

              return (
                <div key={i} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">
                    Section {section.sectionNumber}: {section.sectionName}
                  </h3>
                  {players.length === 0 ? (
                    <p className="text-gray-500">No players in this section.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table table-sm">
                        <thead>
                          <tr className="bg-base-200">
                            <th>Name</th>
                            <th>Rating change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {players.map((player, idx) => (
                            <tr key={idx}>
                              <td>
                                {player.firstName} {player.lastName}
                              </td>
                              <td>
                                {player.ratingRecords.map((record, j) => (
                                  <div key={j}>
                                    {record.preRating} ➡ {record.postRating} ({record.ratingSource})
                                  </div>
                                ))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
