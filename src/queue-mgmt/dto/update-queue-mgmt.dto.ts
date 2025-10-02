import { PartialType } from '@nestjs/mapped-types';
import { CreateQueueMgmtDto } from './create-queue-mgmt.dto';

export class UpdateQueueMgmtDto extends PartialType(CreateQueueMgmtDto) {}
