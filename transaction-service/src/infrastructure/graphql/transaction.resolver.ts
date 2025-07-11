import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTransactionDto } from '../../application/dtos/create-transaction.dto';
import { CreateTransactionCommand } from '../../application/commands/create-transaction.command';
import { GetTransactionQuery } from '../../application/queries/get-transaction.query';
import { TransactionResponseDto } from '../../application/dtos/transaction-response.dto';
import { Logger } from '@nestjs/common';

@Resolver()
export class TransactionResolver {
  private readonly logger = new Logger(TransactionResolver.name);

  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Mutation(() => String)
  async createTransaction(@Args('input') input: CreateTransactionDto): Promise<string> {
    this.logger.log(`Creating transaction with input: ${JSON.stringify(input)}`);
    
    const transaction = await this.commandBus.execute(
      new CreateTransactionCommand(
        input.accountExternalIdDebit,
        input.accountExternalIdCredit,
        input.transferTypeId,
        input.value,
      ),
    );

    return transaction.id;
  }

  @Query(() => TransactionResponseDto)
  async getTransaction(@Args('id') id: string): Promise<TransactionResponseDto> {
    this.logger.log(`Getting transaction with ID: ${id}`);
    
    return this.queryBus.execute(new GetTransactionQuery(id));
  }
}