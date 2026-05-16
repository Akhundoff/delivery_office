export class ApiResult<Status = number, Data = null, Meta = null> {
  constructor(
    public readonly status: Status,
    public readonly data: Data,
    public readonly meta: Meta,
  ) {}
}
