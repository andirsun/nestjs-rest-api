import { Module } from '@nestjs/common';
import { FilesService } from './files.service';

@Module({
  providers: [FilesService],
  exports : [FilesModule]
})
export class FilesModule {}
