import { Module } from '@nestjs/common';
import { FilesService } from '../application/files.service';

@Module({

  providers: [FilesService],
  exports : [FilesService]
})
export class FilesModule {}
