"use client";

import type { DeepPartial } from "@stream.ui/react";
import { Stream } from "@stream.ui/react";
import {
  Camera,
  Clock,
  Footprints,
  Hotel,
  MapPin,
  ShoppingBag,
  Train,
  Utensils,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation shadowing>
  Map,
  MapControls,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerPopup,
  useMap,
} from "@/components/ui/map";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type {
  ItineraryStop,
  StreamingItineraryData,
} from "./streaming-itinerary-schema";

const stopTypeIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  food: Utensils,
  attraction: Camera,
  hotel: Hotel,
  transport: Train,
  activity: Footprints,
  shopping: ShoppingBag,
};

const stopTypeColors: Record<string, string> = {
  food: "bg-orange-500",
  attraction: "bg-blue-500",
  hotel: "bg-purple-500",
  transport: "bg-green-500",
  activity: "bg-pink-500",
  shopping: "bg-amber-500",
};

function getStopIcon(type: string | undefined) {
  if (type && stopTypeIcons[type]) {
    return stopTypeIcons[type];
  }
  return MapPin;
}

function getStopColor(type: string | undefined) {
  if (type && stopTypeColors[type]) {
    return stopTypeColors[type];
  }
  return "bg-gray-500";
}

interface StopMarkerProps {
  stop: DeepPartial<ItineraryStop>;
  index: number;
}

function StopMarker({ stop, index }: StopMarkerProps) {
  const Icon = getStopIcon(stop.type);
  const color = getStopColor(stop.type);

  if (
    stop.longitude === undefined ||
    stop.latitude === undefined ||
    !stop.name
  ) {
    return null;
  }

  return (
    <MapMarker longitude={stop.longitude} latitude={stop.latitude}>
      <MarkerContent>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
            delay: index * 0.1,
          }}
          className="relative"
        >
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-lg",
              color,
            )}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
            {index + 1}
          </div>
        </motion.div>
      </MarkerContent>
      <MarkerPopup className="min-w-[200px]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full",
                color,
              )}
            >
              <Icon className="h-3 w-3 text-white" />
            </div>
            <span className="font-medium">{stop.name}</span>
          </div>
          {stop.description && (
            <p className="text-sm text-muted-foreground">{stop.description}</p>
          )}
          {stop.duration && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {stop.duration}
            </div>
          )}
        </div>
      </MarkerPopup>
    </MapMarker>
  );
}

interface StopListItemProps {
  stop: DeepPartial<ItineraryStop>;
  index: number;
  isLast: boolean;
}

function StopListItem({ stop, index, isLast }: StopListItemProps) {
  const Icon = getStopIcon(stop.type);
  const color = getStopColor(stop.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="flex gap-3"
    >
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
            color,
          )}
        >
          <Icon className="h-3 w-3 text-white" />
        </div>
        {!isLast && <div className="w-px flex-1 bg-border" />}
      </div>

      {/* Content */}
      <div className={cn("pb-4", isLast && "pb-0")}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            #{index + 1}
          </span>
          <span className="font-medium text-sm">{stop.name}</span>
        </div>
        {stop.description && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {stop.description}
          </p>
        )}
        {stop.duration && (
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {stop.duration}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function StopListSkeleton() {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <Skeleton className="h-6 w-6 rounded-full" />
        <div className="w-px flex-1 bg-border" />
      </div>
      <div className="flex-1 pb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-1 h-3 w-48" />
      </div>
    </div>
  );
}

interface CameraControllerProps {
  stops: DeepPartial<ItineraryStop>[];
  isStreaming: boolean;
}

function CameraController({ stops, isStreaming }: CameraControllerProps) {
  const { map, isLoaded } = useMap();
  const prevStopsCountRef = React.useRef(0);

  // Adjust camera as stops are added
  React.useEffect(() => {
    if (!map || !isLoaded || stops.length === 0) return;

    const lngs = stops
      .filter((s) => typeof s.longitude === "number")
      .map((s) => s.longitude as number);
    const lats = stops
      .filter((s) => typeof s.latitude === "number")
      .map((s) => s.latitude as number);

    if (lngs.length === 0 || lats.length === 0) return;

    // Only animate if stops count changed (new stop added)
    const stopsCountChanged = stops.length !== prevStopsCountRef.current;
    prevStopsCountRef.current = stops.length;

    if (!stopsCountChanged) return;

    if (stops.length === 1) {
      // First stop: fly to it
      map.flyTo({
        center: [lngs[0], lats[0]],
        zoom: 14,
        duration: 800,
      });
    } else {
      // Multiple stops: fit bounds with smooth animation
      map.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        {
          padding: 60,
          duration: isStreaming ? 600 : 1000,
        },
      );
    }
  }, [map, isLoaded, stops, isStreaming]);

  // Reset when stops are cleared (new request)
  React.useEffect(() => {
    if (stops.length === 0) {
      prevStopsCountRef.current = 0;
    }
  }, [stops.length]);

  return null;
}

interface StreamingItineraryProps {
  data: DeepPartial<StreamingItineraryData> | undefined;
  isLoading: boolean;
  error?: Error;
  className?: string;
}

export function StreamingItinerary({
  data,
  isLoading,
  error,
  className,
}: StreamingItineraryProps) {
  const isStreaming = isLoading && data !== undefined;
  const isComplete = !isLoading && data !== undefined;
  const currentState = isComplete
    ? "complete"
    : isStreaming
      ? "streaming"
      : isLoading
        ? "loading"
        : "idle";

  const borderColors = {
    idle: "",
    loading: "border-yellow-500/50",
    streaming: "border-blue-500/50",
    complete: "border-green-500/50",
  };

  // Filter valid stops with coordinates
  // IMPORTANT: We wait for `type` to exist because coordinates stream digit-by-digit
  // (e.g., longitude: 2 → 2.3 → 2.33 → 2.3364). Without this check, the camera
  // would fly to partial coordinates like [2, 48] which is in the ocean!
  const validStops = React.useMemo(() => {
    if (!data?.stops) return [];
    return data.stops.filter(
      (stop): stop is DeepPartial<ItineraryStop> =>
        stop !== null &&
        stop !== undefined &&
        typeof stop.name === "string" &&
        typeof stop.longitude === "number" &&
        typeof stop.latitude === "number" &&
        Number.isFinite(stop.longitude) &&
        Number.isFinite(stop.latitude) &&
        typeof stop.type === "string" &&
        stop.type.length > 0,
    );
  }, [data?.stops]);

  // Calculate map bounds to fit all markers
  const mapBounds = React.useMemo(() => {
    if (validStops.length === 0) return null;

    const lngs = validStops.map((s) => s.longitude as number);
    const lats = validStops.map((s) => s.latitude as number);

    return {
      center: [
        (Math.min(...lngs) + Math.max(...lngs)) / 2,
        (Math.min(...lats) + Math.max(...lats)) / 2,
      ] as [number, number],
      // Simple zoom calculation based on spread
      zoom: Math.max(
        2,
        12 -
          Math.log2(
            Math.max(
              Math.max(...lngs) - Math.min(...lngs),
              Math.max(...lats) - Math.min(...lats),
            ) + 0.01,
          ),
      ),
    };
  }, [validStops]);

  // Route coordinates for the line
  const routeCoordinates = React.useMemo(() => {
    return validStops.map(
      (stop) =>
        [stop.longitude as number, stop.latitude as number] as [number, number],
    );
  }, [validStops]);

  return (
    <Stream.Root data={data} isLoading={isLoading} error={error}>
      <Card
        className={cn(
          "w-full max-w-2xl overflow-hidden transition-colors",
          borderColors[currentState],
          className,
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle>
            <Stream.Field fallback={<Skeleton className="h-6 w-48" />}>
              {data?.title}
            </Stream.Field>
          </CardTitle>
          <Stream.Field fallback={<Skeleton className="h-4 w-64" />}>
            {data?.description && (
              <p className="text-sm text-muted-foreground">
                {data.description}
              </p>
            )}
          </Stream.Field>
        </CardHeader>

        <CardContent className="space-y-4 p-0">
          {/* Map */}
          <div className="relative h-[300px] w-full">
            <Map
              center={mapBounds?.center ?? [0, 20]}
              zoom={mapBounds?.zoom ?? 2}
            >
              <CameraController stops={validStops} isStreaming={isStreaming} />
              <MapControls showZoom showLocate={false} />

              {/* Route line */}
              {routeCoordinates.length >= 2 && (
                <MapRoute
                  coordinates={routeCoordinates}
                  color="#3b82f6"
                  width={3}
                  opacity={0.7}
                />
              )}

              {/* Stop markers */}
              <AnimatePresence>
                {validStops.map((stop, index) => (
                  <StopMarker
                    key={stop.id ?? index}
                    stop={stop}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </Map>
          </div>

          {/* Stop list */}
          <div className="max-h-[200px] overflow-y-auto px-6 pb-4">
            {validStops.length > 0 ? (
              <div>
                {validStops.map((stop, index) => (
                  <StopListItem
                    key={stop.id ?? index}
                    stop={stop}
                    index={index}
                    isLast={index === validStops.length - 1 && !isLoading}
                  />
                ))}
                {isLoading && <StopListSkeleton />}
              </div>
            ) : isLoading ? (
              <div className="space-y-2">
                <StopListSkeleton />
                <StopListSkeleton />
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Click a button to generate an itinerary
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Stream.Root>
  );
}
