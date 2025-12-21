import { IPerformance, PartialEventInfo, PerformanceSection } from '../types/types'

interface EventDisplayProps {
  event: PartialEventInfo
  performances: IPerformance[]
}

export default function EventDisplay({ event, performances }: EventDisplayProps) {
  const sections = performances.reduce<PerformanceSection[]>(
    (acc, cur) =>
      acc.some((item) => item.sectionNumber === cur.sectionItem.sectionNumber)
        ? acc
        : [...acc, cur.sectionItem],
    [],
  )

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-title m-4 inline">
        {performances.length} players played in{' '}
        <a href={`https://ratings.uschess.org/event/${event.id}`} target="_blank">
          {event.name}
        </a>
        <span className="ml-4 text-sm">{new Date(event.endDate).toLocaleDateString()}</span>
      </div>

      <div className="card-body">
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
                <div key={i} className="border rounded-lg p-2">
                  <h3 className="font-semibold mb-3">{section.sectionName}</h3>
                  {players.length === 0 ? (
                    <p className="text-gray-500">No players in this section.</p>
                  ) : (
                    <table className="table">
                      <tbody>
                        {players.map((player, idx) => (
                          <tr key={idx}>
                            <td>
                              {player.firstName} {player.lastName}
                            </td>
                            <td>
                              {player.ratingRecords.map((record, j) => (
                                <div key={j} className="flex gap-2">
                                  <div>{record.preRating}</div>
                                  <div>➡</div>
                                  <div>{record.postRating}</div>
                                  <div>
                                    {record.ratingSource === 'R' ? '' : record.ratingSource}
                                  </div>
                                </div>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
