import { Injectable } from '@nestjs/common';
import { CreateYoutubeDto } from './dto/create-youtube.dto';
import * as fs from 'fs';
import ytdl from '@distube/ytdl-core';

@Injectable()
export class YoutubeService {
  async create(createYoutubeDto: CreateYoutubeDto) {
    const videoPath = `output/video-${new Date().getTime()}.mp4`;
    const searchVideoInfo = await ytdl.getInfo(createYoutubeDto.url);

    console.log('Video title:', searchVideoInfo.videoDetails.title);

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

  async searchVideoInfo(url: string) {
    const searchVideoInfo = await ytdl.getInfo(url);
    return {
      title: searchVideoInfo.videoDetails.title,
      thumbnail: searchVideoInfo.videoDetails.thumbnails[0].url,
      duration: searchVideoInfo.videoDetails.lengthSeconds,
    };
  }
}
