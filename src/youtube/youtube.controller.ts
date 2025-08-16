import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { CreateYoutubeDto } from './dto/create-youtube.dto';
import type { FastifyReply } from 'fastify';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post('download-video')
  async create(
    @Res() res: FastifyReply,
    @Body() createYoutubeDto: CreateYoutubeDto,
  ) {
    res.header('Content-type', 'video/mp4');

    const response = await this.youtubeService.create(createYoutubeDto);

    res.send(response);
  }
}
