import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

@InputType()
export class CreateTransactionDto {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @Field()
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @Field()
  @IsUUID()
  @IsNotEmpty()
  transferTypeId: string;

  @Field()
  @IsNumber()
  @IsPositive()
  value: number;
}