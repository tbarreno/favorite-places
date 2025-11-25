export type MapAttrs = {
  lat: number;
  lon: number;
  readonly: boolean;
};

export type PlaceAttrs = {
  placeId: string;
}

export type MainStackParamList = {
  List: undefined;
  AddPlace: MapAttrs | undefined;
  Map: MapAttrs;
  PlaceDetails: PlaceAttrs;
};
