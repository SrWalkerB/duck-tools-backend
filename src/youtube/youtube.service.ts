import { Injectable } from '@nestjs/common';
import { CreateYoutubeDto } from './dto/create-youtube.dto';
import * as fs from 'fs';
import ytdl from '@distube/ytdl-core';

// Configurações para contornar detecção de bot
const ytdlOptions = {
  requestOptions: {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      DNT: '1',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    },
  },
};

@Injectable()
export class YoutubeService {
  async create(createYoutubeDto: CreateYoutubeDto) {
    const videoPath = `output/video-${new Date().getTime()}.mp4`;

    try {
      const searchVideoInfo = await ytdl.getInfo(
        createYoutubeDto.url,
        ytdlOptions,
      );

      console.log('Video title:', searchVideoInfo.videoDetails.title);

      await new Promise((resolve, reject) => {
        ytdl(createYoutubeDto.url, {
          ...ytdlOptions,
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Error downloading video:', errorMessage);
      throw new Error(`Failed to download video: ${errorMessage}`);
    }
  }

  async searchVideoInfo(url: string) {
    try {
      const searchVideoInfo = await ytdl.getInfo(url, ytdlOptions);
      return {
        title: searchVideoInfo.videoDetails.title,
        thumbnail: searchVideoInfo.videoDetails.thumbnails[0].url,
        duration: searchVideoInfo.videoDetails.lengthSeconds,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Error getting video info:', errorMessage);
      throw new Error(`Failed to get video info: ${errorMessage}`);
    }
  }
}
