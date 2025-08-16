import { Injectable } from '@nestjs/common';
import { CreateYoutubeDto } from './dto/create-youtube.dto';
import * as fs from 'fs';
import ytdl from '@distube/ytdl-core';

@Injectable()
export class YoutubeService {
  async create(createYoutubeDto: CreateYoutubeDto) {
    const videoPath = `output/video-${new Date().getTime()}.mp4`;

    await new Promise((resolve, reject) => {
      ytdl(createYoutubeDto.url, {
        quality: 'highest',
        filter: 'videoandaudio',
      })
        .pipe(fs.createWriteStream(videoPath))
        .on('finish', () => {
          console.log('Finished downloading');
          resolve(true);
        })
        .on('error', reject);
    });

    const stream = fs.createReadStream(videoPath).on('end', () => {
      console.log('Finished streaming video and delete video');
      fs.rmSync(videoPath);
      return;
    });

    return stream;
  }
}
