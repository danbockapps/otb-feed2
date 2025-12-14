import { IPerformance, PartialEventInfo } from '../types/types'

interface EventDisplayProps {
  event: PartialEventInfo
  sections: IPerformance[]
}

export default function EventDisplay({ event, sections }: EventDisplayProps) {
  // Calculate total players
  const totalPlayers = sections.reduce((sum, section) => sum + section.ratingRecords.length, 0)

  // Sort sections by sectionNumber ascending
  const sortedSections = [...sections].sort(
    (a, b) => a.sectionItem.sectionNumber - b.sectionItem.sectionNumber,
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
        {sortedSections.length === 0 ? (
          <div className="alert alert-info">
            <span>No sections available for this event.</span>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedSections.map((section) => (
              <div key={section.sectionItem.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">
                  Section {section.sectionItem.sectionNumber}: {section.sectionItem.sectionName}
                </h3>
                {section.ratingRecords.length === 0 ? (
                  <p className="text-gray-500">No players in this section.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table table-sm">
                      <thead>
                        <tr className="bg-base-200">
                          <th>Pre-Rating</th>
                          <th>Post-Rating</th>
                          <th>Source</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.ratingRecords.map((record, idx) => (
                          <tr key={idx}>
                            <td>{record.preRating}</td>
                            <td>{record.postRating}</td>
                            <td>{record.ratingSource}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
