import { Module } from "@nestjs/common";
import { TimeService } from "../application/time.service";


@Module({
  providers: [TimeService],
  exports: [TimeService]
})

export class TimeModule{}