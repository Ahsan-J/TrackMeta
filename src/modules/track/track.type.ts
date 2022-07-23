export type TokenType = {
    access_token: string,
    token_type: string,
    expires_in: number,
}

export type ExternalURLS = {
    spotify: string | URL,
}

export type SpotifyImage = {
    height: number,
    width: number,
    url: string | URL,
}

export type SpotifySearchTracks = {
    href: string | URL,
    items: Array<SpotifySearchItem>,
    limit: number,
    next: string | null,
    offset: number,
    previous: string | null,
    total: number;
}

export type SpotifyAlbumInfo = {
    album_type: 'compilation',
    artists: Array<SpotifyArtist>,
    available_markets: Array<string>, // Array of Country list
    external_urls: ExternalURLS,
    href: string | URL,
    id: string,
    images: Array<SpotifyImage>,
    name: string,
    release_date: string,
    release_date_precision: string,
    total_tracks: number,
    type: string,
    uri: string,
}

export type SpotifyArtist = {
    name: string;
    id: string;
    type: 'artist',
    uri: string,
    href: string | URL,
    external_urls: ExternalURLS, 
}

export type SpotifySearchItem = {
    album: SpotifyAlbumInfo,
    artists: Array<SpotifyArtist>,
    available_markets: Array<string>, // Array of country codes
    disc_number: number,
    duration_ms: number,
    explicit: boolean,
    external_ids: { isrc: string },
    external_urls: ExternalURLS,
    href: string | URL,
    id: string,
    is_local: boolean,
    name: string,
    popularity: number,
    preview_url: string | URL,
    track_number: number,
    type: number,
    uri: string,
}