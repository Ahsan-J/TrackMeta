import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './track.entity';
import { CommonService } from 'src/modules/common/common.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import url from 'url'
import { SpotifyArtist, SpotifyImage, SpotifySearchTracks, TokenType } from './track.type';
import { Artist } from './artist.entity';
import { Images } from './images.entity';
import moment from 'moment';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private metaRepository: Repository<Track>,
    @InjectRepository(Images)
    private imageRepository: Repository<Images>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    private httpService: HttpService,
    private configService: ConfigService,
    @Inject(CommonService)
    private commonService: CommonService
  ) { }

  async getByISRC(isrc: Track['isrc']): Promise<Track> {
    if (!isrc) {
      throw new BadRequestException(`"ISRC" is not definded`)
    }

    const track = await this.metaRepository.findOne({ where: { isrc }, relations:['artist', 'images'] });

    if (!track) {
      throw new BadRequestException(`No Track found for the ISRC ${isrc}`)
    }

    return track;
  }

  async getByArtist(id: Artist['id']): Promise<Array<Track>> {
    if (!id) {
      throw new BadRequestException(`"id" of an artist is required`)
    }

    const artist = await  this.artistRepository.findOne({where:{id}});

    if (!artist) {
      throw new BadRequestException(`No Artist found for the Id ${id}`)
    }

    return this.metaRepository.find({ where: { artist }})
  }

  async createTrack(isrc: string): Promise<Track> {
    
    const { access_token, token_type } = await this.getAPIToken();
    
    const query = new url.URLSearchParams({ 
      q: `isrc:${isrc}`, 
      type: "track" 
    });

    const response = await lastValueFrom(await this.httpService.get<{tracks: SpotifySearchTracks}>(`https://api.spotify.com/v1/search?${query.toString()}`,{
      headers: {
        "Authorization": `${token_type} ${access_token}`,
      },
    }));

    const popularItem = response.data.tracks.items.reduce((prev, current) => (prev.popularity > current.popularity) ? prev : current)
    
    const artists = await this.createArtists(popularItem.artists);
    const images = await this.createImages(popularItem.album.images);

    const track = await this.metaRepository.save({
      artist: artists,
      images,
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
      deleted_at: null,
      isrc,
      status: 1,
      title: popularItem.name,
    })
    
    return track;
  }

  async getAPIToken(): Promise<TokenType> {
    const clientId = this.configService.get("CLIENT_ID");
    const clientSecret = this.configService.get("CLIENT_SECRET");
    const Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`, 'utf-8').toString('base64')}`
    const body = new url.URLSearchParams({ grant_type: 'client_credentials' });
    const observableResponse = await this.httpService.post<TokenType>(`https://accounts.spotify.com/api/token`, body.toString(), {
      headers: { Authorization }
    });
    const response = await lastValueFrom(observableResponse);
    return response.data;
  }

  async createArtists (artists: Array<SpotifyArtist>): Promise<Array<Artist>> {
    const savedItems: Array<Artist> = [];

    for(let i = 0; i < artists.length; i++ ) {
      const artist = artists[i];
      savedItems.push(await this.artistRepository.save({
        id: artist.id,
        name: artist.name,
        spotify_url: artist.external_urls.spotify.toString(),
        status: 1,
        uri: artist.uri,
        created_at: moment().toISOString(),
        updated_at: moment().toISOString(),
        deleted_at: null,
      }));
    }

    return savedItems;
  }

  async createImages(images: Array<SpotifyImage>): Promise<Array<Images>> {
    const savedItems: Array<Images> = [];

    for(let i = 0; i < images.length; i++ ) {
      const img = images[i];
      savedItems.push(await this.imageRepository.save({
        height: img.height,
        width: img.width,
        src: img.url.toString(),
        status: 1,
        created_at: moment().toISOString(),
        updated_at: moment().toISOString(),
        deleted_at: null,
      }));
    }

    return savedItems;
  }
}