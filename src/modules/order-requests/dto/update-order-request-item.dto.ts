import { PartialType } from '@nestjs/swagger';
import { CreateOrderRequestItemDto } from './create-order-request-item.dto';

export class UpdateOrderRequestItemDto extends PartialType(CreateOrderRequestItemDto) {} 