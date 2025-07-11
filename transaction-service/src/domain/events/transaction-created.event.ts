export class TransactionCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly value: number,
    public readonly transferTypeId: string,
  ) {}
}