import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonService } from 'src/modules/common/common.service';
import { Artist } from './artist.entity';
import { CreateMetaBody } from './track.dto';
import { Track } from './track.entity';
import { TrackService } from './track.service';

@ApiTags('Spotify Track')
@Controller()
export class TrackController {
  constructor(
    @Inject(CommonService)
    private commonService: CommonService,
    private metaService: TrackService,
  ) { }

  @Post('track/create')
  async createMeta(@Body() { isrc }: CreateMetaBody): Promise<Track> {
   return this.metaService.createTrack(isrc);
  }

  @Get('artist/:id')
  async getByArtist(@Param('id') id: Artist['id']): Promise<Array<Track>> {
    return this.metaService.getByArtist(id);
  }

  @Get('track/:isrc')
  async getUser(@Param('isrc') isrc: string): Promise<Track> {
    return this.metaService.getByISRC(isrc);
  }
}
