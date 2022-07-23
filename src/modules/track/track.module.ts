import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import {  Track } from './track.entity';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Artist } from './artist.entity';
import { Images } from './images.entity';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([Artist, Images, Track]),
  ],
  providers: [TrackService],
  controllers: [TrackController],
  exports: [TrackService]
})
export class TrackModule {}