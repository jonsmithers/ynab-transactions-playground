export interface Option<T> {
  map<R>(fn: (value: T) => R): Option<R>;
  flatMap<R>(fn: (value: T) => Option<R>): Option<R>;
  filter(fn: (value: T) => boolean): Option<T>;
  unwrap(error?: string): T;
  unwrapOr(val: T): T;
}

export class None<T> implements Option<T> {
  map<R>(): Option<R> {
    return new None();
  }

  flatMap<R>(): Option<R> {
    return new None();
  }

  filter(): Option<T> {
    return new None();
  }

  unwrap(error?: string): T {
    throw new Error(error ?? 'Tried to unwrap None');
  }

  unwrapOr(val: T): T {
    return val;
  }
}

export class Some<T> implements Option<T> {
  constructor(readonly value: T) {}

  map<R>(fn: (value: T) => R): Option<R> {
    return new Some(fn(this.value));
  }

  flatMap<R>(fn: (value: T) => Option<R>): Option<R> {
    return fn(this.value);
  }

  filter(fn: (value: T) => boolean): Option<T> {
    if (fn(this.value)) {
      return this;
    }
    return new None();
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr(): T {
    return this.value;
  }
}

export function fromNullable<T>(maybe?: T | null): Option<T> {
  return maybe == null ? new None() : new Some(maybe!);
}
