import { PartialType } from '@nestjs/swagger';
import { CreateSongRequestDto } from './create-song-request.dto';

export class UpdateSongRequestDto extends PartialType(CreateSongRequestDto) {} 