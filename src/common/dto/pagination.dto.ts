import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class PaginationDto {

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;
}