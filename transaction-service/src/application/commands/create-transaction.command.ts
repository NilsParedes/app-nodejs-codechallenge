export class CreateTransactionCommand {
  constructor(
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly transferTypeId: string,
    public readonly value: number,
  ) {}
}