import { IsString, IsUrl } from 'class-validator';

export class CreateYoutubeDto {
  @IsString()
  @IsUrl()
  url: string;
}
