import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionTypeDto {
  @Field()
  name: string;
}

@ObjectType()
export class TransactionStatusDto {
  @Field()
  name: string;
}

@ObjectType()
export class TransactionResponseDto {
  @Field()
  transactionExternalId: string;

  @Field(() => TransactionTypeDto)
  transactionType: TransactionTypeDto;

  @Field(() => TransactionStatusDto)
  transactionStatus: TransactionStatusDto;

  @Field()
  value: number;

  @Field()
  createdAt: Date;
}