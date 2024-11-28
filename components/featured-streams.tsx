import { Card, CardContent } from '@/components/ui/card';
import { mockFeaturedStreams } from '@/lib/mock-data';

export function FeaturedStreams() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Featured Streams</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockFeaturedStreams.map((stream) => (
          <Card key={stream.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={stream.thumbnailUrl}
                alt={stream.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-3 left-3 bg-red-600 px-2 py-1 rounded text-xs font-medium text-white">
                LIVE
              </div>
              <div className="absolute bottom-3 right-3 bg-black/75 px-2 py-1 rounded text-xs font-medium text-white">
                {stream.viewerCount.toLocaleString()} viewers
              </div>
            </div>
            <CardContent className="p-5">
              <h3 className="font-semibold truncate">{stream.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{stream.game}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {stream.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}