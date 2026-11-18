
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>
/**
 * Model Task
 * 
 */
export type Task = $Result.DefaultSelection<Prisma.$TaskPayload>
/**
 * Model AccountRequest
 * 
 */
export type AccountRequest = $Result.DefaultSelection<Prisma.$AccountRequestPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs>;

  /**
   * `prisma.task`: Exposes CRUD operations for the **Task** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks
    * const tasks = await prisma.task.findMany()
    * ```
    */
  get task(): Prisma.TaskDelegate<ExtArgs>;

  /**
   * `prisma.accountRequest`: Exposes CRUD operations for the **AccountRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AccountRequests
    * const accountRequests = await prisma.accountRequest.findMany()
    * ```
    */
  get accountRequest(): Prisma.AccountRequestDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Message: 'Message',
    Task: 'Task',
    AccountRequest: 'AccountRequest'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "message" | "task" | "accountRequest"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
      Task: {
        payload: Prisma.$TaskPayload<ExtArgs>
        fields: Prisma.TaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findFirst: {
            args: Prisma.TaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findMany: {
            args: Prisma.TaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          create: {
            args: Prisma.TaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          createMany: {
            args: Prisma.TaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          delete: {
            args: Prisma.TaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          update: {
            args: Prisma.TaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          deleteMany: {
            args: Prisma.TaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          aggregate: {
            args: Prisma.TaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTask>
          }
          groupBy: {
            args: Prisma.TaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskCountArgs<ExtArgs>
            result: $Utils.Optional<TaskCountAggregateOutputType> | number
          }
        }
      }
      AccountRequest: {
        payload: Prisma.$AccountRequestPayload<ExtArgs>
        fields: Prisma.AccountRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountRequestPayload>
          }
          findFirst: {
            args: Prisma.AccountRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountRequestPayload>
          }
          findMany: {
            args: Prisma.AccountRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountRequestPayload>[]
          }
          create: {
            args: Prisma.AccountRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountRequestPayload>
          }
          createMany: {
            args: Prisma.AccountRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountRequestPayload>[]
          }
          delete: {
            args: Prisma.AccountRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountRequestPayload>
          }
          update: {
            args: Prisma.AccountRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountRequestPayload>
          }
          deleteMany: {
            args: Prisma.AccountRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AccountRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountRequestPayload>
          }
          aggregate: {
            args: Prisma.AccountRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccountRequest>
          }
          groupBy: {
            args: Prisma.AccountRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountRequestCountArgs<ExtArgs>
            result: $Utils.Optional<AccountRequestCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    assignedTasks: number
    createdTasks: number
    accountRequests: number
    resolvedRequests: number
    sentMessages: number
    receivedMessages: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignedTasks?: boolean | UserCountOutputTypeCountAssignedTasksArgs
    createdTasks?: boolean | UserCountOutputTypeCountCreatedTasksArgs
    accountRequests?: boolean | UserCountOutputTypeCountAccountRequestsArgs
    resolvedRequests?: boolean | UserCountOutputTypeCountResolvedRequestsArgs
    sentMessages?: boolean | UserCountOutputTypeCountSentMessagesArgs
    receivedMessages?: boolean | UserCountOutputTypeCountReceivedMessagesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAssignedTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountRequestWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountResolvedRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountRequestWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSentMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReceivedMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Count Type TaskCountOutputType
   */

  export type TaskCountOutputType = {
    assignees: number
    linkedMessages: number
  }

  export type TaskCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignees?: boolean | TaskCountOutputTypeCountAssigneesArgs
    linkedMessages?: boolean | TaskCountOutputTypeCountLinkedMessagesArgs
  }

  // Custom InputTypes
  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCountOutputType
     */
    select?: TaskCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeCountAssigneesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeCountLinkedMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    username: string | null
    password: string | null
    role: string | null
    fullName: string | null
    email: string | null
    phone: string | null
    address: string | null
    department: string | null
    isFirstLogin: boolean | null
    createdAt: string | null
    createdBy: string | null
    themeMode: string | null
    themeColor: string | null
    status: string | null
    publicKey: string | null
    encryptedPrivateKey: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    password: string | null
    role: string | null
    fullName: string | null
    email: string | null
    phone: string | null
    address: string | null
    department: string | null
    isFirstLogin: boolean | null
    createdAt: string | null
    createdBy: string | null
    themeMode: string | null
    themeColor: string | null
    status: string | null
    publicKey: string | null
    encryptedPrivateKey: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    password: number
    role: number
    fullName: number
    email: number
    phone: number
    address: number
    department: number
    isFirstLogin: number
    createdAt: number
    createdBy: number
    themeMode: number
    themeColor: number
    status: number
    publicKey: number
    encryptedPrivateKey: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    password?: true
    role?: true
    fullName?: true
    email?: true
    phone?: true
    address?: true
    department?: true
    isFirstLogin?: true
    createdAt?: true
    createdBy?: true
    themeMode?: true
    themeColor?: true
    status?: true
    publicKey?: true
    encryptedPrivateKey?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    password?: true
    role?: true
    fullName?: true
    email?: true
    phone?: true
    address?: true
    department?: true
    isFirstLogin?: true
    createdAt?: true
    createdBy?: true
    themeMode?: true
    themeColor?: true
    status?: true
    publicKey?: true
    encryptedPrivateKey?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    password?: true
    role?: true
    fullName?: true
    email?: true
    phone?: true
    address?: true
    department?: true
    isFirstLogin?: true
    createdAt?: true
    createdBy?: true
    themeMode?: true
    themeColor?: true
    status?: true
    publicKey?: true
    encryptedPrivateKey?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    username: string
    password: string
    role: string
    fullName: string
    email: string
    phone: string
    address: string
    department: string
    isFirstLogin: boolean
    createdAt: string
    createdBy: string
    themeMode: string
    themeColor: string
    status: string
    publicKey: string | null
    encryptedPrivateKey: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    role?: boolean
    fullName?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    department?: boolean
    isFirstLogin?: boolean
    createdAt?: boolean
    createdBy?: boolean
    themeMode?: boolean
    themeColor?: boolean
    status?: boolean
    publicKey?: boolean
    encryptedPrivateKey?: boolean
    assignedTasks?: boolean | User$assignedTasksArgs<ExtArgs>
    createdTasks?: boolean | User$createdTasksArgs<ExtArgs>
    accountRequests?: boolean | User$accountRequestsArgs<ExtArgs>
    resolvedRequests?: boolean | User$resolvedRequestsArgs<ExtArgs>
    sentMessages?: boolean | User$sentMessagesArgs<ExtArgs>
    receivedMessages?: boolean | User$receivedMessagesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    role?: boolean
    fullName?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    department?: boolean
    isFirstLogin?: boolean
    createdAt?: boolean
    createdBy?: boolean
    themeMode?: boolean
    themeColor?: boolean
    status?: boolean
    publicKey?: boolean
    encryptedPrivateKey?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    password?: boolean
    role?: boolean
    fullName?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    department?: boolean
    isFirstLogin?: boolean
    createdAt?: boolean
    createdBy?: boolean
    themeMode?: boolean
    themeColor?: boolean
    status?: boolean
    publicKey?: boolean
    encryptedPrivateKey?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignedTasks?: boolean | User$assignedTasksArgs<ExtArgs>
    createdTasks?: boolean | User$createdTasksArgs<ExtArgs>
    accountRequests?: boolean | User$accountRequestsArgs<ExtArgs>
    resolvedRequests?: boolean | User$resolvedRequestsArgs<ExtArgs>
    sentMessages?: boolean | User$sentMessagesArgs<ExtArgs>
    receivedMessages?: boolean | User$receivedMessagesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      assignedTasks: Prisma.$TaskPayload<ExtArgs>[]
      createdTasks: Prisma.$TaskPayload<ExtArgs>[]
      accountRequests: Prisma.$AccountRequestPayload<ExtArgs>[]
      resolvedRequests: Prisma.$AccountRequestPayload<ExtArgs>[]
      sentMessages: Prisma.$MessagePayload<ExtArgs>[]
      receivedMessages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      password: string
      role: string
      fullName: string
      email: string
      phone: string
      address: string
      department: string
      isFirstLogin: boolean
      createdAt: string
      createdBy: string
      themeMode: string
      themeColor: string
      status: string
      publicKey: string | null
      encryptedPrivateKey: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assignedTasks<T extends User$assignedTasksArgs<ExtArgs> = {}>(args?: Subset<T, User$assignedTasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
    createdTasks<T extends User$createdTasksArgs<ExtArgs> = {}>(args?: Subset<T, User$createdTasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
    accountRequests<T extends User$accountRequestsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountRequestPayload<ExtArgs>, T, "findMany"> | Null>
    resolvedRequests<T extends User$resolvedRequestsArgs<ExtArgs> = {}>(args?: Subset<T, User$resolvedRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountRequestPayload<ExtArgs>, T, "findMany"> | Null>
    sentMessages<T extends User$sentMessagesArgs<ExtArgs> = {}>(args?: Subset<T, User$sentMessagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany"> | Null>
    receivedMessages<T extends User$receivedMessagesArgs<ExtArgs> = {}>(args?: Subset<T, User$receivedMessagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly fullName: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly address: FieldRef<"User", 'String'>
    readonly department: FieldRef<"User", 'String'>
    readonly isFirstLogin: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'String'>
    readonly createdBy: FieldRef<"User", 'String'>
    readonly themeMode: FieldRef<"User", 'String'>
    readonly themeColor: FieldRef<"User", 'String'>
    readonly status: FieldRef<"User", 'String'>
    readonly publicKey: FieldRef<"User", 'String'>
    readonly encryptedPrivateKey: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.assignedTasks
   */
  export type User$assignedTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * User.createdTasks
   */
  export type User$createdTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * User.accountRequests
   */
  export type User$accountRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountRequest
     */
    select?: AccountRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountRequestInclude<ExtArgs> | null
    where?: AccountRequestWhereInput
    orderBy?: AccountRequestOrderByWithRelationInput | AccountRequestOrderByWithRelationInput[]
    cursor?: AccountRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountRequestScalarFieldEnum | AccountRequestScalarFieldEnum[]
  }

  /**
   * User.resolvedRequests
   */
  export type User$resolvedRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountRequest
     */
    select?: AccountRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountRequestInclude<ExtArgs> | null
    where?: AccountRequestWhereInput
    orderBy?: AccountRequestOrderByWithRelationInput | AccountRequestOrderByWithRelationInput[]
    cursor?: AccountRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountRequestScalarFieldEnum | AccountRequestScalarFieldEnum[]
  }

  /**
   * User.sentMessages
   */
  export type User$sentMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * User.receivedMessages
   */
  export type User$receivedMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    senderId: string | null
    receiverId: string | null
    ciphertext: string | null
    iv: string | null
    createdAt: string | null
    updatedAt: string | null
    isEdited: boolean | null
    deletedForSender: boolean | null
    deletedForReceiver: boolean | null
    taskId: string | null
    read: boolean | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    senderId: string | null
    receiverId: string | null
    ciphertext: string | null
    iv: string | null
    createdAt: string | null
    updatedAt: string | null
    isEdited: boolean | null
    deletedForSender: boolean | null
    deletedForReceiver: boolean | null
    taskId: string | null
    read: boolean | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    senderId: number
    receiverId: number
    ciphertext: number
    iv: number
    createdAt: number
    updatedAt: number
    isEdited: number
    deletedForSender: number
    deletedForReceiver: number
    taskId: number
    read: number
    _all: number
  }


  export type MessageMinAggregateInputType = {
    id?: true
    senderId?: true
    receiverId?: true
    ciphertext?: true
    iv?: true
    createdAt?: true
    updatedAt?: true
    isEdited?: true
    deletedForSender?: true
    deletedForReceiver?: true
    taskId?: true
    read?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    senderId?: true
    receiverId?: true
    ciphertext?: true
    iv?: true
    createdAt?: true
    updatedAt?: true
    isEdited?: true
    deletedForSender?: true
    deletedForReceiver?: true
    taskId?: true
    read?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    senderId?: true
    receiverId?: true
    ciphertext?: true
    iv?: true
    createdAt?: true
    updatedAt?: true
    isEdited?: true
    deletedForSender?: true
    deletedForReceiver?: true
    taskId?: true
    read?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    senderId: string
    receiverId: string
    ciphertext: string
    iv: string
    createdAt: string
    updatedAt: string | null
    isEdited: boolean
    deletedForSender: boolean
    deletedForReceiver: boolean
    taskId: string | null
    read: boolean
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    ciphertext?: boolean
    iv?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isEdited?: boolean
    deletedForSender?: boolean
    deletedForReceiver?: boolean
    taskId?: boolean
    read?: boolean
    task?: boolean | Message$taskArgs<ExtArgs>
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    ciphertext?: boolean
    iv?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isEdited?: boolean
    deletedForSender?: boolean
    deletedForReceiver?: boolean
    taskId?: boolean
    read?: boolean
    task?: boolean | Message$taskArgs<ExtArgs>
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    ciphertext?: boolean
    iv?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isEdited?: boolean
    deletedForSender?: boolean
    deletedForReceiver?: boolean
    taskId?: boolean
    read?: boolean
  }

  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | Message$taskArgs<ExtArgs>
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | Message$taskArgs<ExtArgs>
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      task: Prisma.$TaskPayload<ExtArgs> | null
      sender: Prisma.$UserPayload<ExtArgs>
      receiver: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      senderId: string
      receiverId: string
      ciphertext: string
      iv: string
      createdAt: string
      updatedAt: string | null
      isEdited: boolean
      deletedForSender: boolean
      deletedForReceiver: boolean
      taskId: string | null
      read: boolean
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    task<T extends Message$taskArgs<ExtArgs> = {}>(args?: Subset<T, Message$taskArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    sender<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    receiver<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Message model
   */ 
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly senderId: FieldRef<"Message", 'String'>
    readonly receiverId: FieldRef<"Message", 'String'>
    readonly ciphertext: FieldRef<"Message", 'String'>
    readonly iv: FieldRef<"Message", 'String'>
    readonly createdAt: FieldRef<"Message", 'String'>
    readonly updatedAt: FieldRef<"Message", 'String'>
    readonly isEdited: FieldRef<"Message", 'Boolean'>
    readonly deletedForSender: FieldRef<"Message", 'Boolean'>
    readonly deletedForReceiver: FieldRef<"Message", 'Boolean'>
    readonly taskId: FieldRef<"Message", 'String'>
    readonly read: FieldRef<"Message", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
  }

  /**
   * Message.task
   */
  export type Message$taskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
  }


  /**
   * Model Task
   */

  export type AggregateTask = {
    _count: TaskCountAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  export type TaskMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    assignedById: string | null
    status: string | null
    priority: string | null
    busyness: string | null
    dueDate: string | null
    createdAt: string | null
    updatedAt: string | null
    notes: string | null
  }

  export type TaskMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    assignedById: string | null
    status: string | null
    priority: string | null
    busyness: string | null
    dueDate: string | null
    createdAt: string | null
    updatedAt: string | null
    notes: string | null
  }

  export type TaskCountAggregateOutputType = {
    id: number
    title: number
    description: number
    assignedById: number
    status: number
    priority: number
    busyness: number
    dueDate: number
    createdAt: number
    updatedAt: number
    notes: number
    _all: number
  }


  export type TaskMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    assignedById?: true
    status?: true
    priority?: true
    busyness?: true
    dueDate?: true
    createdAt?: true
    updatedAt?: true
    notes?: true
  }

  export type TaskMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    assignedById?: true
    status?: true
    priority?: true
    busyness?: true
    dueDate?: true
    createdAt?: true
    updatedAt?: true
    notes?: true
  }

  export type TaskCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    assignedById?: true
    status?: true
    priority?: true
    busyness?: true
    dueDate?: true
    createdAt?: true
    updatedAt?: true
    notes?: true
    _all?: true
  }

  export type TaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Task to aggregate.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tasks
    **/
    _count?: true | TaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskMaxAggregateInputType
  }

  export type GetTaskAggregateType<T extends TaskAggregateArgs> = {
        [P in keyof T & keyof AggregateTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTask[P]>
      : GetScalarType<T[P], AggregateTask[P]>
  }




  export type TaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithAggregationInput | TaskOrderByWithAggregationInput[]
    by: TaskScalarFieldEnum[] | TaskScalarFieldEnum
    having?: TaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskCountAggregateInputType | true
    _min?: TaskMinAggregateInputType
    _max?: TaskMaxAggregateInputType
  }

  export type TaskGroupByOutputType = {
    id: string
    title: string
    description: string
    assignedById: string
    status: string
    priority: string
    busyness: string
    dueDate: string
    createdAt: string
    updatedAt: string
    notes: string
    _count: TaskCountAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  type GetTaskGroupByPayload<T extends TaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskGroupByOutputType[P]>
            : GetScalarType<T[P], TaskGroupByOutputType[P]>
        }
      >
    >


  export type TaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    assignedById?: boolean
    status?: boolean
    priority?: boolean
    busyness?: boolean
    dueDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    notes?: boolean
    assignees?: boolean | Task$assigneesArgs<ExtArgs>
    assignedBy?: boolean | UserDefaultArgs<ExtArgs>
    linkedMessages?: boolean | Task$linkedMessagesArgs<ExtArgs>
    _count?: boolean | TaskCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    assignedById?: boolean
    status?: boolean
    priority?: boolean
    busyness?: boolean
    dueDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    notes?: boolean
    assignedBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    assignedById?: boolean
    status?: boolean
    priority?: boolean
    busyness?: boolean
    dueDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    notes?: boolean
  }

  export type TaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignees?: boolean | Task$assigneesArgs<ExtArgs>
    assignedBy?: boolean | UserDefaultArgs<ExtArgs>
    linkedMessages?: boolean | Task$linkedMessagesArgs<ExtArgs>
    _count?: boolean | TaskCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TaskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignedBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Task"
    objects: {
      assignees: Prisma.$UserPayload<ExtArgs>[]
      assignedBy: Prisma.$UserPayload<ExtArgs>
      linkedMessages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      assignedById: string
      status: string
      priority: string
      busyness: string
      dueDate: string
      createdAt: string
      updatedAt: string
      notes: string
    }, ExtArgs["result"]["task"]>
    composites: {}
  }

  type TaskGetPayload<S extends boolean | null | undefined | TaskDefaultArgs> = $Result.GetResult<Prisma.$TaskPayload, S>

  type TaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TaskFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TaskCountAggregateInputType | true
    }

  export interface TaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Task'], meta: { name: 'Task' } }
    /**
     * Find zero or one Task that matches the filter.
     * @param {TaskFindUniqueArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskFindUniqueArgs>(args: SelectSubset<T, TaskFindUniqueArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Task that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TaskFindUniqueOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Task that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskFindFirstArgs>(args?: SelectSubset<T, TaskFindFirstArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Task that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.task.findMany()
     * 
     * // Get first 10 Tasks
     * const tasks = await prisma.task.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskWithIdOnly = await prisma.task.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskFindManyArgs>(args?: SelectSubset<T, TaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Task.
     * @param {TaskCreateArgs} args - Arguments to create a Task.
     * @example
     * // Create one Task
     * const Task = await prisma.task.create({
     *   data: {
     *     // ... data to create a Task
     *   }
     * })
     * 
     */
    create<T extends TaskCreateArgs>(args: SelectSubset<T, TaskCreateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Tasks.
     * @param {TaskCreateManyArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskCreateManyArgs>(args?: SelectSubset<T, TaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tasks and returns the data saved in the database.
     * @param {TaskCreateManyAndReturnArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Task.
     * @param {TaskDeleteArgs} args - Arguments to delete one Task.
     * @example
     * // Delete one Task
     * const Task = await prisma.task.delete({
     *   where: {
     *     // ... filter to delete one Task
     *   }
     * })
     * 
     */
    delete<T extends TaskDeleteArgs>(args: SelectSubset<T, TaskDeleteArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Task.
     * @param {TaskUpdateArgs} args - Arguments to update one Task.
     * @example
     * // Update one Task
     * const task = await prisma.task.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskUpdateArgs>(args: SelectSubset<T, TaskUpdateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Tasks.
     * @param {TaskDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.task.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskDeleteManyArgs>(args?: SelectSubset<T, TaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskUpdateManyArgs>(args: SelectSubset<T, TaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Task.
     * @param {TaskUpsertArgs} args - Arguments to update or create a Task.
     * @example
     * // Update or create a Task
     * const task = await prisma.task.upsert({
     *   create: {
     *     // ... data to create a Task
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Task we want to update
     *   }
     * })
     */
    upsert<T extends TaskUpsertArgs>(args: SelectSubset<T, TaskUpsertArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.task.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends TaskCountArgs>(
      args?: Subset<T, TaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskAggregateArgs>(args: Subset<T, TaskAggregateArgs>): Prisma.PrismaPromise<GetTaskAggregateType<T>>

    /**
     * Group by Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskGroupByArgs['orderBy'] }
        : { orderBy?: TaskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Task model
   */
  readonly fields: TaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Task.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assignees<T extends Task$assigneesArgs<ExtArgs> = {}>(args?: Subset<T, Task$assigneesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany"> | Null>
    assignedBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    linkedMessages<T extends Task$linkedMessagesArgs<ExtArgs> = {}>(args?: Subset<T, Task$linkedMessagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Task model
   */ 
  interface TaskFieldRefs {
    readonly id: FieldRef<"Task", 'String'>
    readonly title: FieldRef<"Task", 'String'>
    readonly description: FieldRef<"Task", 'String'>
    readonly assignedById: FieldRef<"Task", 'String'>
    readonly status: FieldRef<"Task", 'String'>
    readonly priority: FieldRef<"Task", 'String'>
    readonly busyness: FieldRef<"Task", 'String'>
    readonly dueDate: FieldRef<"Task", 'String'>
    readonly createdAt: FieldRef<"Task", 'String'>
    readonly updatedAt: FieldRef<"Task", 'String'>
    readonly notes: FieldRef<"Task", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Task findUnique
   */
  export type TaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findUniqueOrThrow
   */
  export type TaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findFirst
   */
  export type TaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findFirstOrThrow
   */
  export type TaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findMany
   */
  export type TaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Tasks to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task create
   */
  export type TaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to create a Task.
     */
    data: XOR<TaskCreateInput, TaskUncheckedCreateInput>
  }

  /**
   * Task createMany
   */
  export type TaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Task createManyAndReturn
   */
  export type TaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task update
   */
  export type TaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to update a Task.
     */
    data: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
    /**
     * Choose, which Task to update.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task updateMany
   */
  export type TaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
  }

  /**
   * Task upsert
   */
  export type TaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The filter to search for the Task to update in case it exists.
     */
    where: TaskWhereUniqueInput
    /**
     * In case the Task found by the `where` argument doesn't exist, create a new Task with this data.
     */
    create: XOR<TaskCreateInput, TaskUncheckedCreateInput>
    /**
     * In case the Task was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
  }

  /**
   * Task delete
   */
  export type TaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter which Task to delete.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task deleteMany
   */
  export type TaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tasks to delete
     */
    where?: TaskWhereInput
  }

  /**
   * Task.assignees
   */
  export type Task$assigneesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Task.linkedMessages
   */
  export type Task$linkedMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Task without action
   */
  export type TaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
  }


  /**
   * Model AccountRequest
   */

  export type AggregateAccountRequest = {
    _count: AccountRequestCountAggregateOutputType | null
    _min: AccountRequestMinAggregateOutputType | null
    _max: AccountRequestMaxAggregateOutputType | null
  }

  export type AccountRequestMinAggregateOutputType = {
    id: string | null
    requestedById: string | null
    requestedRole: string | null
    fullName: string | null
    email: string | null
    department: string | null
    reason: string | null
    status: string | null
    createdAt: string | null
    resolvedAt: string | null
    resolvedById: string | null
    rejectionReason: string | null
  }

  export type AccountRequestMaxAggregateOutputType = {
    id: string | null
    requestedById: string | null
    requestedRole: string | null
    fullName: string | null
    email: string | null
    department: string | null
    reason: string | null
    status: string | null
    createdAt: string | null
    resolvedAt: string | null
    resolvedById: string | null
    rejectionReason: string | null
  }

  export type AccountRequestCountAggregateOutputType = {
    id: number
    requestedById: number
    requestedRole: number
    fullName: number
    email: number
    department: number
    reason: number
    status: number
    createdAt: number
    resolvedAt: number
    resolvedById: number
    rejectionReason: number
    _all: number
  }


  export type AccountRequestMinAggregateInputType = {
    id?: true
    requestedById?: true
    requestedRole?: true
    fullName?: true
    email?: true
    department?: true
    reason?: true
    status?: true
    createdAt?: true
    resolvedAt?: true
    resolvedById?: true
    rejectionReason?: true
  }

  export type AccountRequestMaxAggregateInputType = {
    id?: true
    requestedById?: true
    requestedRole?: true
    fullName?: true
    email?: true
    department?: true
    reason?: true
    status?: true
    createdAt?: true
    resolvedAt?: true
    resolvedById?: true
    rejectionReason?: true
  }

  export type AccountRequestCountAggregateInputType = {
    id?: true
    requestedById?: true
    requestedRole?: true
    fullName?: true
    email?: true
    department?: true
    reason?: true
    status?: true
    createdAt?: true
    resolvedAt?: true
    resolvedById?: true
    rejectionReason?: true
    _all?: true
  }

  export type AccountRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccountRequest to aggregate.
     */
    where?: AccountRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccountRequests to fetch.
     */
    orderBy?: AccountRequestOrderByWithRelationInput | AccountRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccountRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccountRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AccountRequests
    **/
    _count?: true | AccountRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountRequestMaxAggregateInputType
  }

  export type GetAccountRequestAggregateType<T extends AccountRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateAccountRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccountRequest[P]>
      : GetScalarType<T[P], AggregateAccountRequest[P]>
  }




  export type AccountRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountRequestWhereInput
    orderBy?: AccountRequestOrderByWithAggregationInput | AccountRequestOrderByWithAggregationInput[]
    by: AccountRequestScalarFieldEnum[] | AccountRequestScalarFieldEnum
    having?: AccountRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountRequestCountAggregateInputType | true
    _min?: AccountRequestMinAggregateInputType
    _max?: AccountRequestMaxAggregateInputType
  }

  export type AccountRequestGroupByOutputType = {
    id: string
    requestedById: string
    requestedRole: string
    fullName: string
    email: string
    department: string
    reason: string
    status: string
    createdAt: string
    resolvedAt: string | null
    resolvedById: string | null
    rejectionReason: string | null
    _count: AccountRequestCountAggregateOutputType | null
    _min: AccountRequestMinAggregateOutputType | null
    _max: AccountRequestMaxAggregateOutputType | null
  }

  type GetAccountRequestGroupByPayload<T extends AccountRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountRequestGroupByOutputType[P]>
            : GetScalarType<T[P], AccountRequestGroupByOutputType[P]>
        }
      >
    >


  export type AccountRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestedById?: boolean
    requestedRole?: boolean
    fullName?: boolean
    email?: boolean
    department?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
    resolvedAt?: boolean
    resolvedById?: boolean
    rejectionReason?: boolean
    requestedBy?: boolean | UserDefaultArgs<ExtArgs>
    resolvedBy?: boolean | AccountRequest$resolvedByArgs<ExtArgs>
  }, ExtArgs["result"]["accountRequest"]>

  export type AccountRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestedById?: boolean
    requestedRole?: boolean
    fullName?: boolean
    email?: boolean
    department?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
    resolvedAt?: boolean
    resolvedById?: boolean
    rejectionReason?: boolean
    requestedBy?: boolean | UserDefaultArgs<ExtArgs>
    resolvedBy?: boolean | AccountRequest$resolvedByArgs<ExtArgs>
  }, ExtArgs["result"]["accountRequest"]>

  export type AccountRequestSelectScalar = {
    id?: boolean
    requestedById?: boolean
    requestedRole?: boolean
    fullName?: boolean
    email?: boolean
    department?: boolean
    reason?: boolean
    status?: boolean
    createdAt?: boolean
    resolvedAt?: boolean
    resolvedById?: boolean
    rejectionReason?: boolean
  }

  export type AccountRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requestedBy?: boolean | UserDefaultArgs<ExtArgs>
    resolvedBy?: boolean | AccountRequest$resolvedByArgs<ExtArgs>
  }
  export type AccountRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requestedBy?: boolean | UserDefaultArgs<ExtArgs>
    resolvedBy?: boolean | AccountRequest$resolvedByArgs<ExtArgs>
  }

  export type $AccountRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AccountRequest"
    objects: {
      requestedBy: Prisma.$UserPayload<ExtArgs>
      resolvedBy: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requestedById: string
      requestedRole: string
      fullName: string
      email: string
      department: string
      reason: string
      status: string
      createdAt: string
      resolvedAt: string | null
      resolvedById: string | null
      rejectionReason: string | null
    }, ExtArgs["result"]["accountRequest"]>
    composites: {}
  }

  type AccountRequestGetPayload<S extends boolean | null | undefined | AccountRequestDefaultArgs> = $Result.GetResult<Prisma.$AccountRequestPayload, S>

  type AccountRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AccountRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AccountRequestCountAggregateInputType | true
    }

  export interface AccountRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AccountRequest'], meta: { name: 'AccountRequest' } }
    /**
     * Find zero or one AccountRequest that matches the filter.
     * @param {AccountRequestFindUniqueArgs} args - Arguments to find a AccountRequest
     * @example
     * // Get one AccountRequest
     * const accountRequest = await prisma.accountRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountRequestFindUniqueArgs>(args: SelectSubset<T, AccountRequestFindUniqueArgs<ExtArgs>>): Prisma__AccountRequestClient<$Result.GetResult<Prisma.$AccountRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AccountRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AccountRequestFindUniqueOrThrowArgs} args - Arguments to find a AccountRequest
     * @example
     * // Get one AccountRequest
     * const accountRequest = await prisma.accountRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountRequestClient<$Result.GetResult<Prisma.$AccountRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AccountRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountRequestFindFirstArgs} args - Arguments to find a AccountRequest
     * @example
     * // Get one AccountRequest
     * const accountRequest = await prisma.accountRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountRequestFindFirstArgs>(args?: SelectSubset<T, AccountRequestFindFirstArgs<ExtArgs>>): Prisma__AccountRequestClient<$Result.GetResult<Prisma.$AccountRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AccountRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountRequestFindFirstOrThrowArgs} args - Arguments to find a AccountRequest
     * @example
     * // Get one AccountRequest
     * const accountRequest = await prisma.accountRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountRequestClient<$Result.GetResult<Prisma.$AccountRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AccountRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AccountRequests
     * const accountRequests = await prisma.accountRequest.findMany()
     * 
     * // Get first 10 AccountRequests
     * const accountRequests = await prisma.accountRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountRequestWithIdOnly = await prisma.accountRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountRequestFindManyArgs>(args?: SelectSubset<T, AccountRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AccountRequest.
     * @param {AccountRequestCreateArgs} args - Arguments to create a AccountRequest.
     * @example
     * // Create one AccountRequest
     * const AccountRequest = await prisma.accountRequest.create({
     *   data: {
     *     // ... data to create a AccountRequest
     *   }
     * })
     * 
     */
    create<T extends AccountRequestCreateArgs>(args: SelectSubset<T, AccountRequestCreateArgs<ExtArgs>>): Prisma__AccountRequestClient<$Result.GetResult<Prisma.$AccountRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AccountRequests.
     * @param {AccountRequestCreateManyArgs} args - Arguments to create many AccountRequests.
     * @example
     * // Create many AccountRequests
     * const accountRequest = await prisma.accountRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountRequestCreateManyArgs>(args?: SelectSubset<T, AccountRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AccountRequests and returns the data saved in the database.
     * @param {AccountRequestCreateManyAndReturnArgs} args - Arguments to create many AccountRequests.
     * @example
     * // Create many AccountRequests
     * const accountRequest = await prisma.accountRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AccountRequests and only return the `id`
     * const accountRequestWithIdOnly = await prisma.accountRequest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountRequestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AccountRequest.
     * @param {AccountRequestDeleteArgs} args - Arguments to delete one AccountRequest.
     * @example
     * // Delete one AccountRequest
     * const AccountRequest = await prisma.accountRequest.delete({
     *   where: {
     *     // ... filter to delete one AccountRequest
     *   }
     * })
     * 
     */
    delete<T extends AccountRequestDeleteArgs>(args: SelectSubset<T, AccountRequestDeleteArgs<ExtArgs>>): Prisma__AccountRequestClient<$Result.GetResult<Prisma.$AccountRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AccountRequest.
     * @param {AccountRequestUpdateArgs} args - Arguments to update one AccountRequest.
     * @example
     * // Update one AccountRequest
     * const accountRequest = await prisma.accountRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountRequestUpdateArgs>(args: SelectSubset<T, AccountRequestUpdateArgs<ExtArgs>>): Prisma__AccountRequestClient<$Result.GetResult<Prisma.$AccountRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AccountRequests.
     * @param {AccountRequestDeleteManyArgs} args - Arguments to filter AccountRequests to delete.
     * @example
     * // Delete a few AccountRequests
     * const { count } = await prisma.accountRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountRequestDeleteManyArgs>(args?: SelectSubset<T, AccountRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccountRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AccountRequests
     * const accountRequest = await prisma.accountRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountRequestUpdateManyArgs>(args: SelectSubset<T, AccountRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AccountRequest.
     * @param {AccountRequestUpsertArgs} args - Arguments to update or create a AccountRequest.
     * @example
     * // Update or create a AccountRequest
     * const accountRequest = await prisma.accountRequest.upsert({
     *   create: {
     *     // ... data to create a AccountRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AccountRequest we want to update
     *   }
     * })
     */
    upsert<T extends AccountRequestUpsertArgs>(args: SelectSubset<T, AccountRequestUpsertArgs<ExtArgs>>): Prisma__AccountRequestClient<$Result.GetResult<Prisma.$AccountRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AccountRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountRequestCountArgs} args - Arguments to filter AccountRequests to count.
     * @example
     * // Count the number of AccountRequests
     * const count = await prisma.accountRequest.count({
     *   where: {
     *     // ... the filter for the AccountRequests we want to count
     *   }
     * })
    **/
    count<T extends AccountRequestCountArgs>(
      args?: Subset<T, AccountRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AccountRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountRequestAggregateArgs>(args: Subset<T, AccountRequestAggregateArgs>): Prisma.PrismaPromise<GetAccountRequestAggregateType<T>>

    /**
     * Group by AccountRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountRequestGroupByArgs['orderBy'] }
        : { orderBy?: AccountRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AccountRequest model
   */
  readonly fields: AccountRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AccountRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    requestedBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    resolvedBy<T extends AccountRequest$resolvedByArgs<ExtArgs> = {}>(args?: Subset<T, AccountRequest$resolvedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AccountRequest model
   */ 
  interface AccountRequestFieldRefs {
    readonly id: FieldRef<"AccountRequest", 'String'>
    readonly requestedById: FieldRef<"AccountRequest", 'String'>
    readonly requestedRole: FieldRef<"AccountRequest", 'String'>
    readonly fullName: FieldRef<"AccountRequest", 'String'>
    readonly email: FieldRef<"AccountRequest", 'String'>
    readonly department: FieldRef<"AccountRequest", 'String'>
    readonly reason: FieldRef<"AccountRequest", 'String'>
    readonly status: FieldRef<"AccountRequest", 'String'>
    readonly createdAt: FieldRef<"AccountRequest", 'String'>
    readonly resolvedAt: FieldRef<"AccountRequest", 'String'>
    readonly resolvedById: FieldRef<"AccountRequest", 'String'>
    readonly rejectionReason: FieldRef<"AccountRequest", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AccountRequest findUnique
   */
  export type AccountRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountRequest
     */
    select?: AccountRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountRequestInclude<ExtArgs> | null
    /**
     * Filter, which AccountRequest to fetch.
     */
    where: AccountRequestWhereUniqueInput
  }

  /**
   * AccountRequest findUniqueOrThrow
   */
  export type AccountRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountRequest
     */
    select?: AccountRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountRequestInclude<ExtArgs> | null
    /**
     * Filter, which AccountRequest to fetch.
     */
    where: AccountRequestWhereUniqueInput
  }

  /**
   * AccountRequest findFirst
   */
  export type AccountRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountRequest
     */
    select?: AccountRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountRequestInclude<ExtArgs> | null
    /**
     * Filter, which AccountRequest to fetch.
     */
    where?: AccountRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccountRequests to fetch.
     */
    orderBy?: AccountRequestOrderByWithRelationInput | AccountRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccountRequests.
     */
    cursor?: AccountRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccountRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccountRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccountRequests.
     */
    distinct?: AccountRequestScalarFieldEnum | AccountRequestScalarFieldEnum[]
  }

  /**
   * AccountRequest findFirstOrThrow
   */
  export type AccountRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountRequest
     */
    select?: AccountRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountRequestInclude<ExtArgs> | null
    /**
     * Filter, which AccountRequest to fetch.
     */
    where?: AccountRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccountRequests to fetch.
     */
    orderBy?: AccountRequestOrderByWithRelationInput | AccountRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccountRequests.
     */
    cursor?: AccountRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccountRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccountRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccountRequests.
     */
    distinct?: AccountRequestScalarFieldEnum | AccountRequestScalarFieldEnum[]
  }

  /**
   * AccountRequest findMany
   */
  export type AccountRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountRequest
     */
    select?: AccountRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountRequestInclude<ExtArgs> | null
    /**
     * Filter, which AccountRequests to fetch.
     */
    where?: AccountRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccountRequests to fetch.
     */
    orderBy?: AccountRequestOrderByWithRelationInput | AccountRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AccountRequests.
     */
    cursor?: AccountRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccountRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccountRequests.
     */
    skip?: number
    distinct?: AccountRequestScalarFieldEnum | AccountRequestScalarFieldEnum[]
  }

  /**
   * AccountRequest create
   */
  export type AccountRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountRequest
     */
    select?: AccountRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a AccountRequest.
     */
    data: XOR<AccountRequestCreateInput, AccountRequestUncheckedCreateInput>
  }

  /**
   * AccountRequest createMany
   */
  export type AccountRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AccountRequests.
     */
    data: AccountRequestCreateManyInput | AccountRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AccountRequest createManyAndReturn
   */
  export type AccountRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountRequest
     */
    select?: AccountRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AccountRequests.
     */
    data: AccountRequestCreateManyInput | AccountRequestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AccountRequest update
   */
  export type AccountRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountRequest
     */
    select?: AccountRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a AccountRequest.
     */
    data: XOR<AccountRequestUpdateInput, AccountRequestUncheckedUpdateInput>
    /**
     * Choose, which AccountRequest to update.
     */
    where: AccountRequestWhereUniqueInput
  }

  /**
   * AccountRequest updateMany
   */
  export type AccountRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AccountRequests.
     */
    data: XOR<AccountRequestUpdateManyMutationInput, AccountRequestUncheckedUpdateManyInput>
    /**
     * Filter which AccountRequests to update
     */
    where?: AccountRequestWhereInput
  }

  /**
   * AccountRequest upsert
   */
  export type AccountRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountRequest
     */
    select?: AccountRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the AccountRequest to update in case it exists.
     */
    where: AccountRequestWhereUniqueInput
    /**
     * In case the AccountRequest found by the `where` argument doesn't exist, create a new AccountRequest with this data.
     */
    create: XOR<AccountRequestCreateInput, AccountRequestUncheckedCreateInput>
    /**
     * In case the AccountRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountRequestUpdateInput, AccountRequestUncheckedUpdateInput>
  }

  /**
   * AccountRequest delete
   */
  export type AccountRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountRequest
     */
    select?: AccountRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountRequestInclude<ExtArgs> | null
    /**
     * Filter which AccountRequest to delete.
     */
    where: AccountRequestWhereUniqueInput
  }

  /**
   * AccountRequest deleteMany
   */
  export type AccountRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccountRequests to delete
     */
    where?: AccountRequestWhereInput
  }

  /**
   * AccountRequest.resolvedBy
   */
  export type AccountRequest$resolvedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * AccountRequest without action
   */
  export type AccountRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountRequest
     */
    select?: AccountRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountRequestInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    password: 'password',
    role: 'role',
    fullName: 'fullName',
    email: 'email',
    phone: 'phone',
    address: 'address',
    department: 'department',
    isFirstLogin: 'isFirstLogin',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    themeMode: 'themeMode',
    themeColor: 'themeColor',
    status: 'status',
    publicKey: 'publicKey',
    encryptedPrivateKey: 'encryptedPrivateKey'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    senderId: 'senderId',
    receiverId: 'receiverId',
    ciphertext: 'ciphertext',
    iv: 'iv',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    isEdited: 'isEdited',
    deletedForSender: 'deletedForSender',
    deletedForReceiver: 'deletedForReceiver',
    taskId: 'taskId',
    read: 'read'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const TaskScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    assignedById: 'assignedById',
    status: 'status',
    priority: 'priority',
    busyness: 'busyness',
    dueDate: 'dueDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    notes: 'notes'
  };

  export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum]


  export const AccountRequestScalarFieldEnum: {
    id: 'id',
    requestedById: 'requestedById',
    requestedRole: 'requestedRole',
    fullName: 'fullName',
    email: 'email',
    department: 'department',
    reason: 'reason',
    status: 'status',
    createdAt: 'createdAt',
    resolvedAt: 'resolvedAt',
    resolvedById: 'resolvedById',
    rejectionReason: 'rejectionReason'
  };

  export type AccountRequestScalarFieldEnum = (typeof AccountRequestScalarFieldEnum)[keyof typeof AccountRequestScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phone?: StringFilter<"User"> | string
    address?: StringFilter<"User"> | string
    department?: StringFilter<"User"> | string
    isFirstLogin?: BoolFilter<"User"> | boolean
    createdAt?: StringFilter<"User"> | string
    createdBy?: StringFilter<"User"> | string
    themeMode?: StringFilter<"User"> | string
    themeColor?: StringFilter<"User"> | string
    status?: StringFilter<"User"> | string
    publicKey?: StringNullableFilter<"User"> | string | null
    encryptedPrivateKey?: StringNullableFilter<"User"> | string | null
    assignedTasks?: TaskListRelationFilter
    createdTasks?: TaskListRelationFilter
    accountRequests?: AccountRequestListRelationFilter
    resolvedRequests?: AccountRequestListRelationFilter
    sentMessages?: MessageListRelationFilter
    receivedMessages?: MessageListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    department?: SortOrder
    isFirstLogin?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    themeMode?: SortOrder
    themeColor?: SortOrder
    status?: SortOrder
    publicKey?: SortOrderInput | SortOrder
    encryptedPrivateKey?: SortOrderInput | SortOrder
    assignedTasks?: TaskOrderByRelationAggregateInput
    createdTasks?: TaskOrderByRelationAggregateInput
    accountRequests?: AccountRequestOrderByRelationAggregateInput
    resolvedRequests?: AccountRequestOrderByRelationAggregateInput
    sentMessages?: MessageOrderByRelationAggregateInput
    receivedMessages?: MessageOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    phone?: StringFilter<"User"> | string
    address?: StringFilter<"User"> | string
    department?: StringFilter<"User"> | string
    isFirstLogin?: BoolFilter<"User"> | boolean
    createdAt?: StringFilter<"User"> | string
    createdBy?: StringFilter<"User"> | string
    themeMode?: StringFilter<"User"> | string
    themeColor?: StringFilter<"User"> | string
    status?: StringFilter<"User"> | string
    publicKey?: StringNullableFilter<"User"> | string | null
    encryptedPrivateKey?: StringNullableFilter<"User"> | string | null
    assignedTasks?: TaskListRelationFilter
    createdTasks?: TaskListRelationFilter
    accountRequests?: AccountRequestListRelationFilter
    resolvedRequests?: AccountRequestListRelationFilter
    sentMessages?: MessageListRelationFilter
    receivedMessages?: MessageListRelationFilter
  }, "id" | "username" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    department?: SortOrder
    isFirstLogin?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    themeMode?: SortOrder
    themeColor?: SortOrder
    status?: SortOrder
    publicKey?: SortOrderInput | SortOrder
    encryptedPrivateKey?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    fullName?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    phone?: StringWithAggregatesFilter<"User"> | string
    address?: StringWithAggregatesFilter<"User"> | string
    department?: StringWithAggregatesFilter<"User"> | string
    isFirstLogin?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: StringWithAggregatesFilter<"User"> | string
    createdBy?: StringWithAggregatesFilter<"User"> | string
    themeMode?: StringWithAggregatesFilter<"User"> | string
    themeColor?: StringWithAggregatesFilter<"User"> | string
    status?: StringWithAggregatesFilter<"User"> | string
    publicKey?: StringNullableWithAggregatesFilter<"User"> | string | null
    encryptedPrivateKey?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    senderId?: StringFilter<"Message"> | string
    receiverId?: StringFilter<"Message"> | string
    ciphertext?: StringFilter<"Message"> | string
    iv?: StringFilter<"Message"> | string
    createdAt?: StringFilter<"Message"> | string
    updatedAt?: StringNullableFilter<"Message"> | string | null
    isEdited?: BoolFilter<"Message"> | boolean
    deletedForSender?: BoolFilter<"Message"> | boolean
    deletedForReceiver?: BoolFilter<"Message"> | boolean
    taskId?: StringNullableFilter<"Message"> | string | null
    read?: BoolFilter<"Message"> | boolean
    task?: XOR<TaskNullableRelationFilter, TaskWhereInput> | null
    sender?: XOR<UserRelationFilter, UserWhereInput>
    receiver?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    ciphertext?: SortOrder
    iv?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrderInput | SortOrder
    isEdited?: SortOrder
    deletedForSender?: SortOrder
    deletedForReceiver?: SortOrder
    taskId?: SortOrderInput | SortOrder
    read?: SortOrder
    task?: TaskOrderByWithRelationInput
    sender?: UserOrderByWithRelationInput
    receiver?: UserOrderByWithRelationInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    senderId?: StringFilter<"Message"> | string
    receiverId?: StringFilter<"Message"> | string
    ciphertext?: StringFilter<"Message"> | string
    iv?: StringFilter<"Message"> | string
    createdAt?: StringFilter<"Message"> | string
    updatedAt?: StringNullableFilter<"Message"> | string | null
    isEdited?: BoolFilter<"Message"> | boolean
    deletedForSender?: BoolFilter<"Message"> | boolean
    deletedForReceiver?: BoolFilter<"Message"> | boolean
    taskId?: StringNullableFilter<"Message"> | string | null
    read?: BoolFilter<"Message"> | boolean
    task?: XOR<TaskNullableRelationFilter, TaskWhereInput> | null
    sender?: XOR<UserRelationFilter, UserWhereInput>
    receiver?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    ciphertext?: SortOrder
    iv?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrderInput | SortOrder
    isEdited?: SortOrder
    deletedForSender?: SortOrder
    deletedForReceiver?: SortOrder
    taskId?: SortOrderInput | SortOrder
    read?: SortOrder
    _count?: MessageCountOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Message"> | string
    senderId?: StringWithAggregatesFilter<"Message"> | string
    receiverId?: StringWithAggregatesFilter<"Message"> | string
    ciphertext?: StringWithAggregatesFilter<"Message"> | string
    iv?: StringWithAggregatesFilter<"Message"> | string
    createdAt?: StringWithAggregatesFilter<"Message"> | string
    updatedAt?: StringNullableWithAggregatesFilter<"Message"> | string | null
    isEdited?: BoolWithAggregatesFilter<"Message"> | boolean
    deletedForSender?: BoolWithAggregatesFilter<"Message"> | boolean
    deletedForReceiver?: BoolWithAggregatesFilter<"Message"> | boolean
    taskId?: StringNullableWithAggregatesFilter<"Message"> | string | null
    read?: BoolWithAggregatesFilter<"Message"> | boolean
  }

  export type TaskWhereInput = {
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    id?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringFilter<"Task"> | string
    assignedById?: StringFilter<"Task"> | string
    status?: StringFilter<"Task"> | string
    priority?: StringFilter<"Task"> | string
    busyness?: StringFilter<"Task"> | string
    dueDate?: StringFilter<"Task"> | string
    createdAt?: StringFilter<"Task"> | string
    updatedAt?: StringFilter<"Task"> | string
    notes?: StringFilter<"Task"> | string
    assignees?: UserListRelationFilter
    assignedBy?: XOR<UserRelationFilter, UserWhereInput>
    linkedMessages?: MessageListRelationFilter
  }

  export type TaskOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    assignedById?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    busyness?: SortOrder
    dueDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    notes?: SortOrder
    assignees?: UserOrderByRelationAggregateInput
    assignedBy?: UserOrderByWithRelationInput
    linkedMessages?: MessageOrderByRelationAggregateInput
  }

  export type TaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    title?: StringFilter<"Task"> | string
    description?: StringFilter<"Task"> | string
    assignedById?: StringFilter<"Task"> | string
    status?: StringFilter<"Task"> | string
    priority?: StringFilter<"Task"> | string
    busyness?: StringFilter<"Task"> | string
    dueDate?: StringFilter<"Task"> | string
    createdAt?: StringFilter<"Task"> | string
    updatedAt?: StringFilter<"Task"> | string
    notes?: StringFilter<"Task"> | string
    assignees?: UserListRelationFilter
    assignedBy?: XOR<UserRelationFilter, UserWhereInput>
    linkedMessages?: MessageListRelationFilter
  }, "id">

  export type TaskOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    assignedById?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    busyness?: SortOrder
    dueDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    notes?: SortOrder
    _count?: TaskCountOrderByAggregateInput
    _max?: TaskMaxOrderByAggregateInput
    _min?: TaskMinOrderByAggregateInput
  }

  export type TaskScalarWhereWithAggregatesInput = {
    AND?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    OR?: TaskScalarWhereWithAggregatesInput[]
    NOT?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Task"> | string
    title?: StringWithAggregatesFilter<"Task"> | string
    description?: StringWithAggregatesFilter<"Task"> | string
    assignedById?: StringWithAggregatesFilter<"Task"> | string
    status?: StringWithAggregatesFilter<"Task"> | string
    priority?: StringWithAggregatesFilter<"Task"> | string
    busyness?: StringWithAggregatesFilter<"Task"> | string
    dueDate?: StringWithAggregatesFilter<"Task"> | string
    createdAt?: StringWithAggregatesFilter<"Task"> | string
    updatedAt?: StringWithAggregatesFilter<"Task"> | string
    notes?: StringWithAggregatesFilter<"Task"> | string
  }

  export type AccountRequestWhereInput = {
    AND?: AccountRequestWhereInput | AccountRequestWhereInput[]
    OR?: AccountRequestWhereInput[]
    NOT?: AccountRequestWhereInput | AccountRequestWhereInput[]
    id?: StringFilter<"AccountRequest"> | string
    requestedById?: StringFilter<"AccountRequest"> | string
    requestedRole?: StringFilter<"AccountRequest"> | string
    fullName?: StringFilter<"AccountRequest"> | string
    email?: StringFilter<"AccountRequest"> | string
    department?: StringFilter<"AccountRequest"> | string
    reason?: StringFilter<"AccountRequest"> | string
    status?: StringFilter<"AccountRequest"> | string
    createdAt?: StringFilter<"AccountRequest"> | string
    resolvedAt?: StringNullableFilter<"AccountRequest"> | string | null
    resolvedById?: StringNullableFilter<"AccountRequest"> | string | null
    rejectionReason?: StringNullableFilter<"AccountRequest"> | string | null
    requestedBy?: XOR<UserRelationFilter, UserWhereInput>
    resolvedBy?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type AccountRequestOrderByWithRelationInput = {
    id?: SortOrder
    requestedById?: SortOrder
    requestedRole?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    department?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    resolvedById?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    requestedBy?: UserOrderByWithRelationInput
    resolvedBy?: UserOrderByWithRelationInput
  }

  export type AccountRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AccountRequestWhereInput | AccountRequestWhereInput[]
    OR?: AccountRequestWhereInput[]
    NOT?: AccountRequestWhereInput | AccountRequestWhereInput[]
    requestedById?: StringFilter<"AccountRequest"> | string
    requestedRole?: StringFilter<"AccountRequest"> | string
    fullName?: StringFilter<"AccountRequest"> | string
    email?: StringFilter<"AccountRequest"> | string
    department?: StringFilter<"AccountRequest"> | string
    reason?: StringFilter<"AccountRequest"> | string
    status?: StringFilter<"AccountRequest"> | string
    createdAt?: StringFilter<"AccountRequest"> | string
    resolvedAt?: StringNullableFilter<"AccountRequest"> | string | null
    resolvedById?: StringNullableFilter<"AccountRequest"> | string | null
    rejectionReason?: StringNullableFilter<"AccountRequest"> | string | null
    requestedBy?: XOR<UserRelationFilter, UserWhereInput>
    resolvedBy?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id">

  export type AccountRequestOrderByWithAggregationInput = {
    id?: SortOrder
    requestedById?: SortOrder
    requestedRole?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    department?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    resolvedById?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    _count?: AccountRequestCountOrderByAggregateInput
    _max?: AccountRequestMaxOrderByAggregateInput
    _min?: AccountRequestMinOrderByAggregateInput
  }

  export type AccountRequestScalarWhereWithAggregatesInput = {
    AND?: AccountRequestScalarWhereWithAggregatesInput | AccountRequestScalarWhereWithAggregatesInput[]
    OR?: AccountRequestScalarWhereWithAggregatesInput[]
    NOT?: AccountRequestScalarWhereWithAggregatesInput | AccountRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AccountRequest"> | string
    requestedById?: StringWithAggregatesFilter<"AccountRequest"> | string
    requestedRole?: StringWithAggregatesFilter<"AccountRequest"> | string
    fullName?: StringWithAggregatesFilter<"AccountRequest"> | string
    email?: StringWithAggregatesFilter<"AccountRequest"> | string
    department?: StringWithAggregatesFilter<"AccountRequest"> | string
    reason?: StringWithAggregatesFilter<"AccountRequest"> | string
    status?: StringWithAggregatesFilter<"AccountRequest"> | string
    createdAt?: StringWithAggregatesFilter<"AccountRequest"> | string
    resolvedAt?: StringNullableWithAggregatesFilter<"AccountRequest"> | string | null
    resolvedById?: StringNullableWithAggregatesFilter<"AccountRequest"> | string | null
    rejectionReason?: StringNullableWithAggregatesFilter<"AccountRequest"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    username: string
    password: string
    role?: string
    fullName: string
    email: string
    phone?: string
    address?: string
    department?: string
    isFirstLogin?: boolean
    createdAt: string
    createdBy?: string
    themeMode?: string
    themeColor?: string
    status?: string
    publicKey?: string | null
    encryptedPrivateKey?: string | null
    assignedTasks?: TaskCreateNestedManyWithoutAssigneesInput
    createdTasks?: TaskCreateNestedManyWithoutAssignedByInput
    accountRequests?: AccountRequestCreateNestedManyWithoutRequestedByInput
    resolvedRequests?: AccountRequestCreateNestedManyWithoutResolvedByInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    password: string
    role?: string
    fullName: string
    email: string
    phone?: string
    address?: string
    department?: string
    isFirstLogin?: boolean
    createdAt: string
    createdBy?: string
    themeMode?: string
    themeColor?: string
    status?: string
    publicKey?: string | null
    encryptedPrivateKey?: string | null
    assignedTasks?: TaskUncheckedCreateNestedManyWithoutAssigneesInput
    createdTasks?: TaskUncheckedCreateNestedManyWithoutAssignedByInput
    accountRequests?: AccountRequestUncheckedCreateNestedManyWithoutRequestedByInput
    resolvedRequests?: AccountRequestUncheckedCreateNestedManyWithoutResolvedByInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTasks?: TaskUpdateManyWithoutAssigneesNestedInput
    createdTasks?: TaskUpdateManyWithoutAssignedByNestedInput
    accountRequests?: AccountRequestUpdateManyWithoutRequestedByNestedInput
    resolvedRequests?: AccountRequestUpdateManyWithoutResolvedByNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTasks?: TaskUncheckedUpdateManyWithoutAssigneesNestedInput
    createdTasks?: TaskUncheckedUpdateManyWithoutAssignedByNestedInput
    accountRequests?: AccountRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    resolvedRequests?: AccountRequestUncheckedUpdateManyWithoutResolvedByNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    password: string
    role?: string
    fullName: string
    email: string
    phone?: string
    address?: string
    department?: string
    isFirstLogin?: boolean
    createdAt: string
    createdBy?: string
    themeMode?: string
    themeColor?: string
    status?: string
    publicKey?: string | null
    encryptedPrivateKey?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageCreateInput = {
    id?: string
    ciphertext: string
    iv: string
    createdAt: string
    updatedAt?: string | null
    isEdited?: boolean
    deletedForSender?: boolean
    deletedForReceiver?: boolean
    read?: boolean
    task?: TaskCreateNestedOneWithoutLinkedMessagesInput
    sender: UserCreateNestedOneWithoutSentMessagesInput
    receiver: UserCreateNestedOneWithoutReceivedMessagesInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    senderId: string
    receiverId: string
    ciphertext: string
    iv: string
    createdAt: string
    updatedAt?: string | null
    isEdited?: boolean
    deletedForSender?: boolean
    deletedForReceiver?: boolean
    taskId?: string | null
    read?: boolean
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ciphertext?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    deletedForSender?: BoolFieldUpdateOperationsInput | boolean
    deletedForReceiver?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
    task?: TaskUpdateOneWithoutLinkedMessagesNestedInput
    sender?: UserUpdateOneRequiredWithoutSentMessagesNestedInput
    receiver?: UserUpdateOneRequiredWithoutReceivedMessagesNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    ciphertext?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    deletedForSender?: BoolFieldUpdateOperationsInput | boolean
    deletedForReceiver?: BoolFieldUpdateOperationsInput | boolean
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    read?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MessageCreateManyInput = {
    id?: string
    senderId: string
    receiverId: string
    ciphertext: string
    iv: string
    createdAt: string
    updatedAt?: string | null
    isEdited?: boolean
    deletedForSender?: boolean
    deletedForReceiver?: boolean
    taskId?: string | null
    read?: boolean
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ciphertext?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    deletedForSender?: BoolFieldUpdateOperationsInput | boolean
    deletedForReceiver?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    ciphertext?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    deletedForSender?: BoolFieldUpdateOperationsInput | boolean
    deletedForReceiver?: BoolFieldUpdateOperationsInput | boolean
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    read?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TaskCreateInput = {
    id?: string
    title: string
    description?: string
    status?: string
    priority?: string
    busyness?: string
    dueDate: string
    createdAt: string
    updatedAt: string
    notes?: string
    assignees?: UserCreateNestedManyWithoutAssignedTasksInput
    assignedBy: UserCreateNestedOneWithoutCreatedTasksInput
    linkedMessages?: MessageCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateInput = {
    id?: string
    title: string
    description?: string
    assignedById: string
    status?: string
    priority?: string
    busyness?: string
    dueDate: string
    createdAt: string
    updatedAt: string
    notes?: string
    assignees?: UserUncheckedCreateNestedManyWithoutAssignedTasksInput
    linkedMessages?: MessageUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    busyness?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    assignees?: UserUpdateManyWithoutAssignedTasksNestedInput
    assignedBy?: UserUpdateOneRequiredWithoutCreatedTasksNestedInput
    linkedMessages?: MessageUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    assignedById?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    busyness?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    assignees?: UserUncheckedUpdateManyWithoutAssignedTasksNestedInput
    linkedMessages?: MessageUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskCreateManyInput = {
    id?: string
    title: string
    description?: string
    assignedById: string
    status?: string
    priority?: string
    busyness?: string
    dueDate: string
    createdAt: string
    updatedAt: string
    notes?: string
  }

  export type TaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    busyness?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
  }

  export type TaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    assignedById?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    busyness?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
  }

  export type AccountRequestCreateInput = {
    id?: string
    requestedRole?: string
    fullName: string
    email: string
    department?: string
    reason: string
    status?: string
    createdAt: string
    resolvedAt?: string | null
    rejectionReason?: string | null
    requestedBy: UserCreateNestedOneWithoutAccountRequestsInput
    resolvedBy?: UserCreateNestedOneWithoutResolvedRequestsInput
  }

  export type AccountRequestUncheckedCreateInput = {
    id?: string
    requestedById: string
    requestedRole?: string
    fullName: string
    email: string
    department?: string
    reason: string
    status?: string
    createdAt: string
    resolvedAt?: string | null
    resolvedById?: string | null
    rejectionReason?: string | null
  }

  export type AccountRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedRole?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    resolvedAt?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    requestedBy?: UserUpdateOneRequiredWithoutAccountRequestsNestedInput
    resolvedBy?: UserUpdateOneWithoutResolvedRequestsNestedInput
  }

  export type AccountRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedById?: StringFieldUpdateOperationsInput | string
    requestedRole?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    resolvedAt?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedById?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountRequestCreateManyInput = {
    id?: string
    requestedById: string
    requestedRole?: string
    fullName: string
    email: string
    department?: string
    reason: string
    status?: string
    createdAt: string
    resolvedAt?: string | null
    resolvedById?: string | null
    rejectionReason?: string | null
  }

  export type AccountRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedRole?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    resolvedAt?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedById?: StringFieldUpdateOperationsInput | string
    requestedRole?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    resolvedAt?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedById?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type TaskListRelationFilter = {
    every?: TaskWhereInput
    some?: TaskWhereInput
    none?: TaskWhereInput
  }

  export type AccountRequestListRelationFilter = {
    every?: AccountRequestWhereInput
    some?: AccountRequestWhereInput
    none?: AccountRequestWhereInput
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    department?: SortOrder
    isFirstLogin?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    themeMode?: SortOrder
    themeColor?: SortOrder
    status?: SortOrder
    publicKey?: SortOrder
    encryptedPrivateKey?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    department?: SortOrder
    isFirstLogin?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    themeMode?: SortOrder
    themeColor?: SortOrder
    status?: SortOrder
    publicKey?: SortOrder
    encryptedPrivateKey?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    department?: SortOrder
    isFirstLogin?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    themeMode?: SortOrder
    themeColor?: SortOrder
    status?: SortOrder
    publicKey?: SortOrder
    encryptedPrivateKey?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type TaskNullableRelationFilter = {
    is?: TaskWhereInput | null
    isNot?: TaskWhereInput | null
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    ciphertext?: SortOrder
    iv?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isEdited?: SortOrder
    deletedForSender?: SortOrder
    deletedForReceiver?: SortOrder
    taskId?: SortOrder
    read?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    ciphertext?: SortOrder
    iv?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isEdited?: SortOrder
    deletedForSender?: SortOrder
    deletedForReceiver?: SortOrder
    taskId?: SortOrder
    read?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    ciphertext?: SortOrder
    iv?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isEdited?: SortOrder
    deletedForSender?: SortOrder
    deletedForReceiver?: SortOrder
    taskId?: SortOrder
    read?: SortOrder
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    assignedById?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    busyness?: SortOrder
    dueDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    notes?: SortOrder
  }

  export type TaskMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    assignedById?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    busyness?: SortOrder
    dueDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    notes?: SortOrder
  }

  export type TaskMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    assignedById?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    busyness?: SortOrder
    dueDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    notes?: SortOrder
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type AccountRequestCountOrderByAggregateInput = {
    id?: SortOrder
    requestedById?: SortOrder
    requestedRole?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    department?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    resolvedAt?: SortOrder
    resolvedById?: SortOrder
    rejectionReason?: SortOrder
  }

  export type AccountRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    requestedById?: SortOrder
    requestedRole?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    department?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    resolvedAt?: SortOrder
    resolvedById?: SortOrder
    rejectionReason?: SortOrder
  }

  export type AccountRequestMinOrderByAggregateInput = {
    id?: SortOrder
    requestedById?: SortOrder
    requestedRole?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    department?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    resolvedAt?: SortOrder
    resolvedById?: SortOrder
    rejectionReason?: SortOrder
  }

  export type TaskCreateNestedManyWithoutAssigneesInput = {
    create?: XOR<TaskCreateWithoutAssigneesInput, TaskUncheckedCreateWithoutAssigneesInput> | TaskCreateWithoutAssigneesInput[] | TaskUncheckedCreateWithoutAssigneesInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssigneesInput | TaskCreateOrConnectWithoutAssigneesInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutAssignedByInput = {
    create?: XOR<TaskCreateWithoutAssignedByInput, TaskUncheckedCreateWithoutAssignedByInput> | TaskCreateWithoutAssignedByInput[] | TaskUncheckedCreateWithoutAssignedByInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssignedByInput | TaskCreateOrConnectWithoutAssignedByInput[]
    createMany?: TaskCreateManyAssignedByInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type AccountRequestCreateNestedManyWithoutRequestedByInput = {
    create?: XOR<AccountRequestCreateWithoutRequestedByInput, AccountRequestUncheckedCreateWithoutRequestedByInput> | AccountRequestCreateWithoutRequestedByInput[] | AccountRequestUncheckedCreateWithoutRequestedByInput[]
    connectOrCreate?: AccountRequestCreateOrConnectWithoutRequestedByInput | AccountRequestCreateOrConnectWithoutRequestedByInput[]
    createMany?: AccountRequestCreateManyRequestedByInputEnvelope
    connect?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
  }

  export type AccountRequestCreateNestedManyWithoutResolvedByInput = {
    create?: XOR<AccountRequestCreateWithoutResolvedByInput, AccountRequestUncheckedCreateWithoutResolvedByInput> | AccountRequestCreateWithoutResolvedByInput[] | AccountRequestUncheckedCreateWithoutResolvedByInput[]
    connectOrCreate?: AccountRequestCreateOrConnectWithoutResolvedByInput | AccountRequestCreateOrConnectWithoutResolvedByInput[]
    createMany?: AccountRequestCreateManyResolvedByInputEnvelope
    connect?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutSenderInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutReceiverInput = {
    create?: XOR<MessageCreateWithoutReceiverInput, MessageUncheckedCreateWithoutReceiverInput> | MessageCreateWithoutReceiverInput[] | MessageUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutReceiverInput | MessageCreateOrConnectWithoutReceiverInput[]
    createMany?: MessageCreateManyReceiverInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutAssigneesInput = {
    create?: XOR<TaskCreateWithoutAssigneesInput, TaskUncheckedCreateWithoutAssigneesInput> | TaskCreateWithoutAssigneesInput[] | TaskUncheckedCreateWithoutAssigneesInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssigneesInput | TaskCreateOrConnectWithoutAssigneesInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutAssignedByInput = {
    create?: XOR<TaskCreateWithoutAssignedByInput, TaskUncheckedCreateWithoutAssignedByInput> | TaskCreateWithoutAssignedByInput[] | TaskUncheckedCreateWithoutAssignedByInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssignedByInput | TaskCreateOrConnectWithoutAssignedByInput[]
    createMany?: TaskCreateManyAssignedByInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type AccountRequestUncheckedCreateNestedManyWithoutRequestedByInput = {
    create?: XOR<AccountRequestCreateWithoutRequestedByInput, AccountRequestUncheckedCreateWithoutRequestedByInput> | AccountRequestCreateWithoutRequestedByInput[] | AccountRequestUncheckedCreateWithoutRequestedByInput[]
    connectOrCreate?: AccountRequestCreateOrConnectWithoutRequestedByInput | AccountRequestCreateOrConnectWithoutRequestedByInput[]
    createMany?: AccountRequestCreateManyRequestedByInputEnvelope
    connect?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
  }

  export type AccountRequestUncheckedCreateNestedManyWithoutResolvedByInput = {
    create?: XOR<AccountRequestCreateWithoutResolvedByInput, AccountRequestUncheckedCreateWithoutResolvedByInput> | AccountRequestCreateWithoutResolvedByInput[] | AccountRequestUncheckedCreateWithoutResolvedByInput[]
    connectOrCreate?: AccountRequestCreateOrConnectWithoutResolvedByInput | AccountRequestCreateOrConnectWithoutResolvedByInput[]
    createMany?: AccountRequestCreateManyResolvedByInputEnvelope
    connect?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutSenderInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutReceiverInput = {
    create?: XOR<MessageCreateWithoutReceiverInput, MessageUncheckedCreateWithoutReceiverInput> | MessageCreateWithoutReceiverInput[] | MessageUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutReceiverInput | MessageCreateOrConnectWithoutReceiverInput[]
    createMany?: MessageCreateManyReceiverInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type TaskUpdateManyWithoutAssigneesNestedInput = {
    create?: XOR<TaskCreateWithoutAssigneesInput, TaskUncheckedCreateWithoutAssigneesInput> | TaskCreateWithoutAssigneesInput[] | TaskUncheckedCreateWithoutAssigneesInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssigneesInput | TaskCreateOrConnectWithoutAssigneesInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutAssigneesInput | TaskUpsertWithWhereUniqueWithoutAssigneesInput[]
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutAssigneesInput | TaskUpdateWithWhereUniqueWithoutAssigneesInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutAssigneesInput | TaskUpdateManyWithWhereWithoutAssigneesInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutAssignedByNestedInput = {
    create?: XOR<TaskCreateWithoutAssignedByInput, TaskUncheckedCreateWithoutAssignedByInput> | TaskCreateWithoutAssignedByInput[] | TaskUncheckedCreateWithoutAssignedByInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssignedByInput | TaskCreateOrConnectWithoutAssignedByInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutAssignedByInput | TaskUpsertWithWhereUniqueWithoutAssignedByInput[]
    createMany?: TaskCreateManyAssignedByInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutAssignedByInput | TaskUpdateWithWhereUniqueWithoutAssignedByInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutAssignedByInput | TaskUpdateManyWithWhereWithoutAssignedByInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type AccountRequestUpdateManyWithoutRequestedByNestedInput = {
    create?: XOR<AccountRequestCreateWithoutRequestedByInput, AccountRequestUncheckedCreateWithoutRequestedByInput> | AccountRequestCreateWithoutRequestedByInput[] | AccountRequestUncheckedCreateWithoutRequestedByInput[]
    connectOrCreate?: AccountRequestCreateOrConnectWithoutRequestedByInput | AccountRequestCreateOrConnectWithoutRequestedByInput[]
    upsert?: AccountRequestUpsertWithWhereUniqueWithoutRequestedByInput | AccountRequestUpsertWithWhereUniqueWithoutRequestedByInput[]
    createMany?: AccountRequestCreateManyRequestedByInputEnvelope
    set?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
    disconnect?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
    delete?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
    connect?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
    update?: AccountRequestUpdateWithWhereUniqueWithoutRequestedByInput | AccountRequestUpdateWithWhereUniqueWithoutRequestedByInput[]
    updateMany?: AccountRequestUpdateManyWithWhereWithoutRequestedByInput | AccountRequestUpdateManyWithWhereWithoutRequestedByInput[]
    deleteMany?: AccountRequestScalarWhereInput | AccountRequestScalarWhereInput[]
  }

  export type AccountRequestUpdateManyWithoutResolvedByNestedInput = {
    create?: XOR<AccountRequestCreateWithoutResolvedByInput, AccountRequestUncheckedCreateWithoutResolvedByInput> | AccountRequestCreateWithoutResolvedByInput[] | AccountRequestUncheckedCreateWithoutResolvedByInput[]
    connectOrCreate?: AccountRequestCreateOrConnectWithoutResolvedByInput | AccountRequestCreateOrConnectWithoutResolvedByInput[]
    upsert?: AccountRequestUpsertWithWhereUniqueWithoutResolvedByInput | AccountRequestUpsertWithWhereUniqueWithoutResolvedByInput[]
    createMany?: AccountRequestCreateManyResolvedByInputEnvelope
    set?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
    disconnect?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
    delete?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
    connect?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
    update?: AccountRequestUpdateWithWhereUniqueWithoutResolvedByInput | AccountRequestUpdateWithWhereUniqueWithoutResolvedByInput[]
    updateMany?: AccountRequestUpdateManyWithWhereWithoutResolvedByInput | AccountRequestUpdateManyWithWhereWithoutResolvedByInput[]
    deleteMany?: AccountRequestScalarWhereInput | AccountRequestScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutSenderNestedInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSenderInput | MessageUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSenderInput | MessageUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSenderInput | MessageUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<MessageCreateWithoutReceiverInput, MessageUncheckedCreateWithoutReceiverInput> | MessageCreateWithoutReceiverInput[] | MessageUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutReceiverInput | MessageCreateOrConnectWithoutReceiverInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutReceiverInput | MessageUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: MessageCreateManyReceiverInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutReceiverInput | MessageUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutReceiverInput | MessageUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutAssigneesNestedInput = {
    create?: XOR<TaskCreateWithoutAssigneesInput, TaskUncheckedCreateWithoutAssigneesInput> | TaskCreateWithoutAssigneesInput[] | TaskUncheckedCreateWithoutAssigneesInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssigneesInput | TaskCreateOrConnectWithoutAssigneesInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutAssigneesInput | TaskUpsertWithWhereUniqueWithoutAssigneesInput[]
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutAssigneesInput | TaskUpdateWithWhereUniqueWithoutAssigneesInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutAssigneesInput | TaskUpdateManyWithWhereWithoutAssigneesInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutAssignedByNestedInput = {
    create?: XOR<TaskCreateWithoutAssignedByInput, TaskUncheckedCreateWithoutAssignedByInput> | TaskCreateWithoutAssignedByInput[] | TaskUncheckedCreateWithoutAssignedByInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAssignedByInput | TaskCreateOrConnectWithoutAssignedByInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutAssignedByInput | TaskUpsertWithWhereUniqueWithoutAssignedByInput[]
    createMany?: TaskCreateManyAssignedByInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutAssignedByInput | TaskUpdateWithWhereUniqueWithoutAssignedByInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutAssignedByInput | TaskUpdateManyWithWhereWithoutAssignedByInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type AccountRequestUncheckedUpdateManyWithoutRequestedByNestedInput = {
    create?: XOR<AccountRequestCreateWithoutRequestedByInput, AccountRequestUncheckedCreateWithoutRequestedByInput> | AccountRequestCreateWithoutRequestedByInput[] | AccountRequestUncheckedCreateWithoutRequestedByInput[]
    connectOrCreate?: AccountRequestCreateOrConnectWithoutRequestedByInput | AccountRequestCreateOrConnectWithoutRequestedByInput[]
    upsert?: AccountRequestUpsertWithWhereUniqueWithoutRequestedByInput | AccountRequestUpsertWithWhereUniqueWithoutRequestedByInput[]
    createMany?: AccountRequestCreateManyRequestedByInputEnvelope
    set?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
    disconnect?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
    delete?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
    connect?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
    update?: AccountRequestUpdateWithWhereUniqueWithoutRequestedByInput | AccountRequestUpdateWithWhereUniqueWithoutRequestedByInput[]
    updateMany?: AccountRequestUpdateManyWithWhereWithoutRequestedByInput | AccountRequestUpdateManyWithWhereWithoutRequestedByInput[]
    deleteMany?: AccountRequestScalarWhereInput | AccountRequestScalarWhereInput[]
  }

  export type AccountRequestUncheckedUpdateManyWithoutResolvedByNestedInput = {
    create?: XOR<AccountRequestCreateWithoutResolvedByInput, AccountRequestUncheckedCreateWithoutResolvedByInput> | AccountRequestCreateWithoutResolvedByInput[] | AccountRequestUncheckedCreateWithoutResolvedByInput[]
    connectOrCreate?: AccountRequestCreateOrConnectWithoutResolvedByInput | AccountRequestCreateOrConnectWithoutResolvedByInput[]
    upsert?: AccountRequestUpsertWithWhereUniqueWithoutResolvedByInput | AccountRequestUpsertWithWhereUniqueWithoutResolvedByInput[]
    createMany?: AccountRequestCreateManyResolvedByInputEnvelope
    set?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
    disconnect?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
    delete?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
    connect?: AccountRequestWhereUniqueInput | AccountRequestWhereUniqueInput[]
    update?: AccountRequestUpdateWithWhereUniqueWithoutResolvedByInput | AccountRequestUpdateWithWhereUniqueWithoutResolvedByInput[]
    updateMany?: AccountRequestUpdateManyWithWhereWithoutResolvedByInput | AccountRequestUpdateManyWithWhereWithoutResolvedByInput[]
    deleteMany?: AccountRequestScalarWhereInput | AccountRequestScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSenderInput | MessageUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSenderInput | MessageUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSenderInput | MessageUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<MessageCreateWithoutReceiverInput, MessageUncheckedCreateWithoutReceiverInput> | MessageCreateWithoutReceiverInput[] | MessageUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutReceiverInput | MessageCreateOrConnectWithoutReceiverInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutReceiverInput | MessageUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: MessageCreateManyReceiverInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutReceiverInput | MessageUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutReceiverInput | MessageUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type TaskCreateNestedOneWithoutLinkedMessagesInput = {
    create?: XOR<TaskCreateWithoutLinkedMessagesInput, TaskUncheckedCreateWithoutLinkedMessagesInput>
    connectOrCreate?: TaskCreateOrConnectWithoutLinkedMessagesInput
    connect?: TaskWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutSentMessagesInput = {
    create?: XOR<UserCreateWithoutSentMessagesInput, UserUncheckedCreateWithoutSentMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentMessagesInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReceivedMessagesInput = {
    create?: XOR<UserCreateWithoutReceivedMessagesInput, UserUncheckedCreateWithoutReceivedMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedMessagesInput
    connect?: UserWhereUniqueInput
  }

  export type TaskUpdateOneWithoutLinkedMessagesNestedInput = {
    create?: XOR<TaskCreateWithoutLinkedMessagesInput, TaskUncheckedCreateWithoutLinkedMessagesInput>
    connectOrCreate?: TaskCreateOrConnectWithoutLinkedMessagesInput
    upsert?: TaskUpsertWithoutLinkedMessagesInput
    disconnect?: TaskWhereInput | boolean
    delete?: TaskWhereInput | boolean
    connect?: TaskWhereUniqueInput
    update?: XOR<XOR<TaskUpdateToOneWithWhereWithoutLinkedMessagesInput, TaskUpdateWithoutLinkedMessagesInput>, TaskUncheckedUpdateWithoutLinkedMessagesInput>
  }

  export type UserUpdateOneRequiredWithoutSentMessagesNestedInput = {
    create?: XOR<UserCreateWithoutSentMessagesInput, UserUncheckedCreateWithoutSentMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentMessagesInput
    upsert?: UserUpsertWithoutSentMessagesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSentMessagesInput, UserUpdateWithoutSentMessagesInput>, UserUncheckedUpdateWithoutSentMessagesInput>
  }

  export type UserUpdateOneRequiredWithoutReceivedMessagesNestedInput = {
    create?: XOR<UserCreateWithoutReceivedMessagesInput, UserUncheckedCreateWithoutReceivedMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedMessagesInput
    upsert?: UserUpsertWithoutReceivedMessagesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReceivedMessagesInput, UserUpdateWithoutReceivedMessagesInput>, UserUncheckedUpdateWithoutReceivedMessagesInput>
  }

  export type UserCreateNestedManyWithoutAssignedTasksInput = {
    create?: XOR<UserCreateWithoutAssignedTasksInput, UserUncheckedCreateWithoutAssignedTasksInput> | UserCreateWithoutAssignedTasksInput[] | UserUncheckedCreateWithoutAssignedTasksInput[]
    connectOrCreate?: UserCreateOrConnectWithoutAssignedTasksInput | UserCreateOrConnectWithoutAssignedTasksInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutCreatedTasksInput = {
    create?: XOR<UserCreateWithoutCreatedTasksInput, UserUncheckedCreateWithoutCreatedTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedTasksInput
    connect?: UserWhereUniqueInput
  }

  export type MessageCreateNestedManyWithoutTaskInput = {
    create?: XOR<MessageCreateWithoutTaskInput, MessageUncheckedCreateWithoutTaskInput> | MessageCreateWithoutTaskInput[] | MessageUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutTaskInput | MessageCreateOrConnectWithoutTaskInput[]
    createMany?: MessageCreateManyTaskInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutAssignedTasksInput = {
    create?: XOR<UserCreateWithoutAssignedTasksInput, UserUncheckedCreateWithoutAssignedTasksInput> | UserCreateWithoutAssignedTasksInput[] | UserUncheckedCreateWithoutAssignedTasksInput[]
    connectOrCreate?: UserCreateOrConnectWithoutAssignedTasksInput | UserCreateOrConnectWithoutAssignedTasksInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutTaskInput = {
    create?: XOR<MessageCreateWithoutTaskInput, MessageUncheckedCreateWithoutTaskInput> | MessageCreateWithoutTaskInput[] | MessageUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutTaskInput | MessageCreateOrConnectWithoutTaskInput[]
    createMany?: MessageCreateManyTaskInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutAssignedTasksNestedInput = {
    create?: XOR<UserCreateWithoutAssignedTasksInput, UserUncheckedCreateWithoutAssignedTasksInput> | UserCreateWithoutAssignedTasksInput[] | UserUncheckedCreateWithoutAssignedTasksInput[]
    connectOrCreate?: UserCreateOrConnectWithoutAssignedTasksInput | UserCreateOrConnectWithoutAssignedTasksInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutAssignedTasksInput | UserUpsertWithWhereUniqueWithoutAssignedTasksInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutAssignedTasksInput | UserUpdateWithWhereUniqueWithoutAssignedTasksInput[]
    updateMany?: UserUpdateManyWithWhereWithoutAssignedTasksInput | UserUpdateManyWithWhereWithoutAssignedTasksInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUpdateOneRequiredWithoutCreatedTasksNestedInput = {
    create?: XOR<UserCreateWithoutCreatedTasksInput, UserUncheckedCreateWithoutCreatedTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedTasksInput
    upsert?: UserUpsertWithoutCreatedTasksInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatedTasksInput, UserUpdateWithoutCreatedTasksInput>, UserUncheckedUpdateWithoutCreatedTasksInput>
  }

  export type MessageUpdateManyWithoutTaskNestedInput = {
    create?: XOR<MessageCreateWithoutTaskInput, MessageUncheckedCreateWithoutTaskInput> | MessageCreateWithoutTaskInput[] | MessageUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutTaskInput | MessageCreateOrConnectWithoutTaskInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutTaskInput | MessageUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: MessageCreateManyTaskInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutTaskInput | MessageUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutTaskInput | MessageUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutAssignedTasksNestedInput = {
    create?: XOR<UserCreateWithoutAssignedTasksInput, UserUncheckedCreateWithoutAssignedTasksInput> | UserCreateWithoutAssignedTasksInput[] | UserUncheckedCreateWithoutAssignedTasksInput[]
    connectOrCreate?: UserCreateOrConnectWithoutAssignedTasksInput | UserCreateOrConnectWithoutAssignedTasksInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutAssignedTasksInput | UserUpsertWithWhereUniqueWithoutAssignedTasksInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutAssignedTasksInput | UserUpdateWithWhereUniqueWithoutAssignedTasksInput[]
    updateMany?: UserUpdateManyWithWhereWithoutAssignedTasksInput | UserUpdateManyWithWhereWithoutAssignedTasksInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: XOR<MessageCreateWithoutTaskInput, MessageUncheckedCreateWithoutTaskInput> | MessageCreateWithoutTaskInput[] | MessageUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutTaskInput | MessageCreateOrConnectWithoutTaskInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutTaskInput | MessageUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: MessageCreateManyTaskInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutTaskInput | MessageUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutTaskInput | MessageUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAccountRequestsInput = {
    create?: XOR<UserCreateWithoutAccountRequestsInput, UserUncheckedCreateWithoutAccountRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountRequestsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutResolvedRequestsInput = {
    create?: XOR<UserCreateWithoutResolvedRequestsInput, UserUncheckedCreateWithoutResolvedRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutResolvedRequestsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAccountRequestsNestedInput = {
    create?: XOR<UserCreateWithoutAccountRequestsInput, UserUncheckedCreateWithoutAccountRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountRequestsInput
    upsert?: UserUpsertWithoutAccountRequestsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountRequestsInput, UserUpdateWithoutAccountRequestsInput>, UserUncheckedUpdateWithoutAccountRequestsInput>
  }

  export type UserUpdateOneWithoutResolvedRequestsNestedInput = {
    create?: XOR<UserCreateWithoutResolvedRequestsInput, UserUncheckedCreateWithoutResolvedRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutResolvedRequestsInput
    upsert?: UserUpsertWithoutResolvedRequestsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutResolvedRequestsInput, UserUpdateWithoutResolvedRequestsInput>, UserUncheckedUpdateWithoutResolvedRequestsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type TaskCreateWithoutAssigneesInput = {
    id?: string
    title: string
    description?: string
    status?: string
    priority?: string
    busyness?: string
    dueDate: string
    createdAt: string
    updatedAt: string
    notes?: string
    assignedBy: UserCreateNestedOneWithoutCreatedTasksInput
    linkedMessages?: MessageCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutAssigneesInput = {
    id?: string
    title: string
    description?: string
    assignedById: string
    status?: string
    priority?: string
    busyness?: string
    dueDate: string
    createdAt: string
    updatedAt: string
    notes?: string
    linkedMessages?: MessageUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutAssigneesInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutAssigneesInput, TaskUncheckedCreateWithoutAssigneesInput>
  }

  export type TaskCreateWithoutAssignedByInput = {
    id?: string
    title: string
    description?: string
    status?: string
    priority?: string
    busyness?: string
    dueDate: string
    createdAt: string
    updatedAt: string
    notes?: string
    assignees?: UserCreateNestedManyWithoutAssignedTasksInput
    linkedMessages?: MessageCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutAssignedByInput = {
    id?: string
    title: string
    description?: string
    status?: string
    priority?: string
    busyness?: string
    dueDate: string
    createdAt: string
    updatedAt: string
    notes?: string
    assignees?: UserUncheckedCreateNestedManyWithoutAssignedTasksInput
    linkedMessages?: MessageUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutAssignedByInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutAssignedByInput, TaskUncheckedCreateWithoutAssignedByInput>
  }

  export type TaskCreateManyAssignedByInputEnvelope = {
    data: TaskCreateManyAssignedByInput | TaskCreateManyAssignedByInput[]
    skipDuplicates?: boolean
  }

  export type AccountRequestCreateWithoutRequestedByInput = {
    id?: string
    requestedRole?: string
    fullName: string
    email: string
    department?: string
    reason: string
    status?: string
    createdAt: string
    resolvedAt?: string | null
    rejectionReason?: string | null
    resolvedBy?: UserCreateNestedOneWithoutResolvedRequestsInput
  }

  export type AccountRequestUncheckedCreateWithoutRequestedByInput = {
    id?: string
    requestedRole?: string
    fullName: string
    email: string
    department?: string
    reason: string
    status?: string
    createdAt: string
    resolvedAt?: string | null
    resolvedById?: string | null
    rejectionReason?: string | null
  }

  export type AccountRequestCreateOrConnectWithoutRequestedByInput = {
    where: AccountRequestWhereUniqueInput
    create: XOR<AccountRequestCreateWithoutRequestedByInput, AccountRequestUncheckedCreateWithoutRequestedByInput>
  }

  export type AccountRequestCreateManyRequestedByInputEnvelope = {
    data: AccountRequestCreateManyRequestedByInput | AccountRequestCreateManyRequestedByInput[]
    skipDuplicates?: boolean
  }

  export type AccountRequestCreateWithoutResolvedByInput = {
    id?: string
    requestedRole?: string
    fullName: string
    email: string
    department?: string
    reason: string
    status?: string
    createdAt: string
    resolvedAt?: string | null
    rejectionReason?: string | null
    requestedBy: UserCreateNestedOneWithoutAccountRequestsInput
  }

  export type AccountRequestUncheckedCreateWithoutResolvedByInput = {
    id?: string
    requestedById: string
    requestedRole?: string
    fullName: string
    email: string
    department?: string
    reason: string
    status?: string
    createdAt: string
    resolvedAt?: string | null
    rejectionReason?: string | null
  }

  export type AccountRequestCreateOrConnectWithoutResolvedByInput = {
    where: AccountRequestWhereUniqueInput
    create: XOR<AccountRequestCreateWithoutResolvedByInput, AccountRequestUncheckedCreateWithoutResolvedByInput>
  }

  export type AccountRequestCreateManyResolvedByInputEnvelope = {
    data: AccountRequestCreateManyResolvedByInput | AccountRequestCreateManyResolvedByInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutSenderInput = {
    id?: string
    ciphertext: string
    iv: string
    createdAt: string
    updatedAt?: string | null
    isEdited?: boolean
    deletedForSender?: boolean
    deletedForReceiver?: boolean
    read?: boolean
    task?: TaskCreateNestedOneWithoutLinkedMessagesInput
    receiver: UserCreateNestedOneWithoutReceivedMessagesInput
  }

  export type MessageUncheckedCreateWithoutSenderInput = {
    id?: string
    receiverId: string
    ciphertext: string
    iv: string
    createdAt: string
    updatedAt?: string | null
    isEdited?: boolean
    deletedForSender?: boolean
    deletedForReceiver?: boolean
    taskId?: string | null
    read?: boolean
  }

  export type MessageCreateOrConnectWithoutSenderInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput>
  }

  export type MessageCreateManySenderInputEnvelope = {
    data: MessageCreateManySenderInput | MessageCreateManySenderInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutReceiverInput = {
    id?: string
    ciphertext: string
    iv: string
    createdAt: string
    updatedAt?: string | null
    isEdited?: boolean
    deletedForSender?: boolean
    deletedForReceiver?: boolean
    read?: boolean
    task?: TaskCreateNestedOneWithoutLinkedMessagesInput
    sender: UserCreateNestedOneWithoutSentMessagesInput
  }

  export type MessageUncheckedCreateWithoutReceiverInput = {
    id?: string
    senderId: string
    ciphertext: string
    iv: string
    createdAt: string
    updatedAt?: string | null
    isEdited?: boolean
    deletedForSender?: boolean
    deletedForReceiver?: boolean
    taskId?: string | null
    read?: boolean
  }

  export type MessageCreateOrConnectWithoutReceiverInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutReceiverInput, MessageUncheckedCreateWithoutReceiverInput>
  }

  export type MessageCreateManyReceiverInputEnvelope = {
    data: MessageCreateManyReceiverInput | MessageCreateManyReceiverInput[]
    skipDuplicates?: boolean
  }

  export type TaskUpsertWithWhereUniqueWithoutAssigneesInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutAssigneesInput, TaskUncheckedUpdateWithoutAssigneesInput>
    create: XOR<TaskCreateWithoutAssigneesInput, TaskUncheckedCreateWithoutAssigneesInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutAssigneesInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutAssigneesInput, TaskUncheckedUpdateWithoutAssigneesInput>
  }

  export type TaskUpdateManyWithWhereWithoutAssigneesInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutAssigneesInput>
  }

  export type TaskScalarWhereInput = {
    AND?: TaskScalarWhereInput | TaskScalarWhereInput[]
    OR?: TaskScalarWhereInput[]
    NOT?: TaskScalarWhereInput | TaskScalarWhereInput[]
    id?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringFilter<"Task"> | string
    assignedById?: StringFilter<"Task"> | string
    status?: StringFilter<"Task"> | string
    priority?: StringFilter<"Task"> | string
    busyness?: StringFilter<"Task"> | string
    dueDate?: StringFilter<"Task"> | string
    createdAt?: StringFilter<"Task"> | string
    updatedAt?: StringFilter<"Task"> | string
    notes?: StringFilter<"Task"> | string
  }

  export type TaskUpsertWithWhereUniqueWithoutAssignedByInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutAssignedByInput, TaskUncheckedUpdateWithoutAssignedByInput>
    create: XOR<TaskCreateWithoutAssignedByInput, TaskUncheckedCreateWithoutAssignedByInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutAssignedByInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutAssignedByInput, TaskUncheckedUpdateWithoutAssignedByInput>
  }

  export type TaskUpdateManyWithWhereWithoutAssignedByInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutAssignedByInput>
  }

  export type AccountRequestUpsertWithWhereUniqueWithoutRequestedByInput = {
    where: AccountRequestWhereUniqueInput
    update: XOR<AccountRequestUpdateWithoutRequestedByInput, AccountRequestUncheckedUpdateWithoutRequestedByInput>
    create: XOR<AccountRequestCreateWithoutRequestedByInput, AccountRequestUncheckedCreateWithoutRequestedByInput>
  }

  export type AccountRequestUpdateWithWhereUniqueWithoutRequestedByInput = {
    where: AccountRequestWhereUniqueInput
    data: XOR<AccountRequestUpdateWithoutRequestedByInput, AccountRequestUncheckedUpdateWithoutRequestedByInput>
  }

  export type AccountRequestUpdateManyWithWhereWithoutRequestedByInput = {
    where: AccountRequestScalarWhereInput
    data: XOR<AccountRequestUpdateManyMutationInput, AccountRequestUncheckedUpdateManyWithoutRequestedByInput>
  }

  export type AccountRequestScalarWhereInput = {
    AND?: AccountRequestScalarWhereInput | AccountRequestScalarWhereInput[]
    OR?: AccountRequestScalarWhereInput[]
    NOT?: AccountRequestScalarWhereInput | AccountRequestScalarWhereInput[]
    id?: StringFilter<"AccountRequest"> | string
    requestedById?: StringFilter<"AccountRequest"> | string
    requestedRole?: StringFilter<"AccountRequest"> | string
    fullName?: StringFilter<"AccountRequest"> | string
    email?: StringFilter<"AccountRequest"> | string
    department?: StringFilter<"AccountRequest"> | string
    reason?: StringFilter<"AccountRequest"> | string
    status?: StringFilter<"AccountRequest"> | string
    createdAt?: StringFilter<"AccountRequest"> | string
    resolvedAt?: StringNullableFilter<"AccountRequest"> | string | null
    resolvedById?: StringNullableFilter<"AccountRequest"> | string | null
    rejectionReason?: StringNullableFilter<"AccountRequest"> | string | null
  }

  export type AccountRequestUpsertWithWhereUniqueWithoutResolvedByInput = {
    where: AccountRequestWhereUniqueInput
    update: XOR<AccountRequestUpdateWithoutResolvedByInput, AccountRequestUncheckedUpdateWithoutResolvedByInput>
    create: XOR<AccountRequestCreateWithoutResolvedByInput, AccountRequestUncheckedCreateWithoutResolvedByInput>
  }

  export type AccountRequestUpdateWithWhereUniqueWithoutResolvedByInput = {
    where: AccountRequestWhereUniqueInput
    data: XOR<AccountRequestUpdateWithoutResolvedByInput, AccountRequestUncheckedUpdateWithoutResolvedByInput>
  }

  export type AccountRequestUpdateManyWithWhereWithoutResolvedByInput = {
    where: AccountRequestScalarWhereInput
    data: XOR<AccountRequestUpdateManyMutationInput, AccountRequestUncheckedUpdateManyWithoutResolvedByInput>
  }

  export type MessageUpsertWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutSenderInput, MessageUncheckedUpdateWithoutSenderInput>
    create: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutSenderInput, MessageUncheckedUpdateWithoutSenderInput>
  }

  export type MessageUpdateManyWithWhereWithoutSenderInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutSenderInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: StringFilter<"Message"> | string
    senderId?: StringFilter<"Message"> | string
    receiverId?: StringFilter<"Message"> | string
    ciphertext?: StringFilter<"Message"> | string
    iv?: StringFilter<"Message"> | string
    createdAt?: StringFilter<"Message"> | string
    updatedAt?: StringNullableFilter<"Message"> | string | null
    isEdited?: BoolFilter<"Message"> | boolean
    deletedForSender?: BoolFilter<"Message"> | boolean
    deletedForReceiver?: BoolFilter<"Message"> | boolean
    taskId?: StringNullableFilter<"Message"> | string | null
    read?: BoolFilter<"Message"> | boolean
  }

  export type MessageUpsertWithWhereUniqueWithoutReceiverInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutReceiverInput, MessageUncheckedUpdateWithoutReceiverInput>
    create: XOR<MessageCreateWithoutReceiverInput, MessageUncheckedCreateWithoutReceiverInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutReceiverInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutReceiverInput, MessageUncheckedUpdateWithoutReceiverInput>
  }

  export type MessageUpdateManyWithWhereWithoutReceiverInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutReceiverInput>
  }

  export type TaskCreateWithoutLinkedMessagesInput = {
    id?: string
    title: string
    description?: string
    status?: string
    priority?: string
    busyness?: string
    dueDate: string
    createdAt: string
    updatedAt: string
    notes?: string
    assignees?: UserCreateNestedManyWithoutAssignedTasksInput
    assignedBy: UserCreateNestedOneWithoutCreatedTasksInput
  }

  export type TaskUncheckedCreateWithoutLinkedMessagesInput = {
    id?: string
    title: string
    description?: string
    assignedById: string
    status?: string
    priority?: string
    busyness?: string
    dueDate: string
    createdAt: string
    updatedAt: string
    notes?: string
    assignees?: UserUncheckedCreateNestedManyWithoutAssignedTasksInput
  }

  export type TaskCreateOrConnectWithoutLinkedMessagesInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutLinkedMessagesInput, TaskUncheckedCreateWithoutLinkedMessagesInput>
  }

  export type UserCreateWithoutSentMessagesInput = {
    id?: string
    username: string
    password: string
    role?: string
    fullName: string
    email: string
    phone?: string
    address?: string
    department?: string
    isFirstLogin?: boolean
    createdAt: string
    createdBy?: string
    themeMode?: string
    themeColor?: string
    status?: string
    publicKey?: string | null
    encryptedPrivateKey?: string | null
    assignedTasks?: TaskCreateNestedManyWithoutAssigneesInput
    createdTasks?: TaskCreateNestedManyWithoutAssignedByInput
    accountRequests?: AccountRequestCreateNestedManyWithoutRequestedByInput
    resolvedRequests?: AccountRequestCreateNestedManyWithoutResolvedByInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutSentMessagesInput = {
    id?: string
    username: string
    password: string
    role?: string
    fullName: string
    email: string
    phone?: string
    address?: string
    department?: string
    isFirstLogin?: boolean
    createdAt: string
    createdBy?: string
    themeMode?: string
    themeColor?: string
    status?: string
    publicKey?: string | null
    encryptedPrivateKey?: string | null
    assignedTasks?: TaskUncheckedCreateNestedManyWithoutAssigneesInput
    createdTasks?: TaskUncheckedCreateNestedManyWithoutAssignedByInput
    accountRequests?: AccountRequestUncheckedCreateNestedManyWithoutRequestedByInput
    resolvedRequests?: AccountRequestUncheckedCreateNestedManyWithoutResolvedByInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutSentMessagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSentMessagesInput, UserUncheckedCreateWithoutSentMessagesInput>
  }

  export type UserCreateWithoutReceivedMessagesInput = {
    id?: string
    username: string
    password: string
    role?: string
    fullName: string
    email: string
    phone?: string
    address?: string
    department?: string
    isFirstLogin?: boolean
    createdAt: string
    createdBy?: string
    themeMode?: string
    themeColor?: string
    status?: string
    publicKey?: string | null
    encryptedPrivateKey?: string | null
    assignedTasks?: TaskCreateNestedManyWithoutAssigneesInput
    createdTasks?: TaskCreateNestedManyWithoutAssignedByInput
    accountRequests?: AccountRequestCreateNestedManyWithoutRequestedByInput
    resolvedRequests?: AccountRequestCreateNestedManyWithoutResolvedByInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
  }

  export type UserUncheckedCreateWithoutReceivedMessagesInput = {
    id?: string
    username: string
    password: string
    role?: string
    fullName: string
    email: string
    phone?: string
    address?: string
    department?: string
    isFirstLogin?: boolean
    createdAt: string
    createdBy?: string
    themeMode?: string
    themeColor?: string
    status?: string
    publicKey?: string | null
    encryptedPrivateKey?: string | null
    assignedTasks?: TaskUncheckedCreateNestedManyWithoutAssigneesInput
    createdTasks?: TaskUncheckedCreateNestedManyWithoutAssignedByInput
    accountRequests?: AccountRequestUncheckedCreateNestedManyWithoutRequestedByInput
    resolvedRequests?: AccountRequestUncheckedCreateNestedManyWithoutResolvedByInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
  }

  export type UserCreateOrConnectWithoutReceivedMessagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReceivedMessagesInput, UserUncheckedCreateWithoutReceivedMessagesInput>
  }

  export type TaskUpsertWithoutLinkedMessagesInput = {
    update: XOR<TaskUpdateWithoutLinkedMessagesInput, TaskUncheckedUpdateWithoutLinkedMessagesInput>
    create: XOR<TaskCreateWithoutLinkedMessagesInput, TaskUncheckedCreateWithoutLinkedMessagesInput>
    where?: TaskWhereInput
  }

  export type TaskUpdateToOneWithWhereWithoutLinkedMessagesInput = {
    where?: TaskWhereInput
    data: XOR<TaskUpdateWithoutLinkedMessagesInput, TaskUncheckedUpdateWithoutLinkedMessagesInput>
  }

  export type TaskUpdateWithoutLinkedMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    busyness?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    assignees?: UserUpdateManyWithoutAssignedTasksNestedInput
    assignedBy?: UserUpdateOneRequiredWithoutCreatedTasksNestedInput
  }

  export type TaskUncheckedUpdateWithoutLinkedMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    assignedById?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    busyness?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    assignees?: UserUncheckedUpdateManyWithoutAssignedTasksNestedInput
  }

  export type UserUpsertWithoutSentMessagesInput = {
    update: XOR<UserUpdateWithoutSentMessagesInput, UserUncheckedUpdateWithoutSentMessagesInput>
    create: XOR<UserCreateWithoutSentMessagesInput, UserUncheckedCreateWithoutSentMessagesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSentMessagesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSentMessagesInput, UserUncheckedUpdateWithoutSentMessagesInput>
  }

  export type UserUpdateWithoutSentMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTasks?: TaskUpdateManyWithoutAssigneesNestedInput
    createdTasks?: TaskUpdateManyWithoutAssignedByNestedInput
    accountRequests?: AccountRequestUpdateManyWithoutRequestedByNestedInput
    resolvedRequests?: AccountRequestUpdateManyWithoutResolvedByNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutSentMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTasks?: TaskUncheckedUpdateManyWithoutAssigneesNestedInput
    createdTasks?: TaskUncheckedUpdateManyWithoutAssignedByNestedInput
    accountRequests?: AccountRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    resolvedRequests?: AccountRequestUncheckedUpdateManyWithoutResolvedByNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserUpsertWithoutReceivedMessagesInput = {
    update: XOR<UserUpdateWithoutReceivedMessagesInput, UserUncheckedUpdateWithoutReceivedMessagesInput>
    create: XOR<UserCreateWithoutReceivedMessagesInput, UserUncheckedCreateWithoutReceivedMessagesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReceivedMessagesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReceivedMessagesInput, UserUncheckedUpdateWithoutReceivedMessagesInput>
  }

  export type UserUpdateWithoutReceivedMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTasks?: TaskUpdateManyWithoutAssigneesNestedInput
    createdTasks?: TaskUpdateManyWithoutAssignedByNestedInput
    accountRequests?: AccountRequestUpdateManyWithoutRequestedByNestedInput
    resolvedRequests?: AccountRequestUpdateManyWithoutResolvedByNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
  }

  export type UserUncheckedUpdateWithoutReceivedMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTasks?: TaskUncheckedUpdateManyWithoutAssigneesNestedInput
    createdTasks?: TaskUncheckedUpdateManyWithoutAssignedByNestedInput
    accountRequests?: AccountRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    resolvedRequests?: AccountRequestUncheckedUpdateManyWithoutResolvedByNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
  }

  export type UserCreateWithoutAssignedTasksInput = {
    id?: string
    username: string
    password: string
    role?: string
    fullName: string
    email: string
    phone?: string
    address?: string
    department?: string
    isFirstLogin?: boolean
    createdAt: string
    createdBy?: string
    themeMode?: string
    themeColor?: string
    status?: string
    publicKey?: string | null
    encryptedPrivateKey?: string | null
    createdTasks?: TaskCreateNestedManyWithoutAssignedByInput
    accountRequests?: AccountRequestCreateNestedManyWithoutRequestedByInput
    resolvedRequests?: AccountRequestCreateNestedManyWithoutResolvedByInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutAssignedTasksInput = {
    id?: string
    username: string
    password: string
    role?: string
    fullName: string
    email: string
    phone?: string
    address?: string
    department?: string
    isFirstLogin?: boolean
    createdAt: string
    createdBy?: string
    themeMode?: string
    themeColor?: string
    status?: string
    publicKey?: string | null
    encryptedPrivateKey?: string | null
    createdTasks?: TaskUncheckedCreateNestedManyWithoutAssignedByInput
    accountRequests?: AccountRequestUncheckedCreateNestedManyWithoutRequestedByInput
    resolvedRequests?: AccountRequestUncheckedCreateNestedManyWithoutResolvedByInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutAssignedTasksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAssignedTasksInput, UserUncheckedCreateWithoutAssignedTasksInput>
  }

  export type UserCreateWithoutCreatedTasksInput = {
    id?: string
    username: string
    password: string
    role?: string
    fullName: string
    email: string
    phone?: string
    address?: string
    department?: string
    isFirstLogin?: boolean
    createdAt: string
    createdBy?: string
    themeMode?: string
    themeColor?: string
    status?: string
    publicKey?: string | null
    encryptedPrivateKey?: string | null
    assignedTasks?: TaskCreateNestedManyWithoutAssigneesInput
    accountRequests?: AccountRequestCreateNestedManyWithoutRequestedByInput
    resolvedRequests?: AccountRequestCreateNestedManyWithoutResolvedByInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutCreatedTasksInput = {
    id?: string
    username: string
    password: string
    role?: string
    fullName: string
    email: string
    phone?: string
    address?: string
    department?: string
    isFirstLogin?: boolean
    createdAt: string
    createdBy?: string
    themeMode?: string
    themeColor?: string
    status?: string
    publicKey?: string | null
    encryptedPrivateKey?: string | null
    assignedTasks?: TaskUncheckedCreateNestedManyWithoutAssigneesInput
    accountRequests?: AccountRequestUncheckedCreateNestedManyWithoutRequestedByInput
    resolvedRequests?: AccountRequestUncheckedCreateNestedManyWithoutResolvedByInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutCreatedTasksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatedTasksInput, UserUncheckedCreateWithoutCreatedTasksInput>
  }

  export type MessageCreateWithoutTaskInput = {
    id?: string
    ciphertext: string
    iv: string
    createdAt: string
    updatedAt?: string | null
    isEdited?: boolean
    deletedForSender?: boolean
    deletedForReceiver?: boolean
    read?: boolean
    sender: UserCreateNestedOneWithoutSentMessagesInput
    receiver: UserCreateNestedOneWithoutReceivedMessagesInput
  }

  export type MessageUncheckedCreateWithoutTaskInput = {
    id?: string
    senderId: string
    receiverId: string
    ciphertext: string
    iv: string
    createdAt: string
    updatedAt?: string | null
    isEdited?: boolean
    deletedForSender?: boolean
    deletedForReceiver?: boolean
    read?: boolean
  }

  export type MessageCreateOrConnectWithoutTaskInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutTaskInput, MessageUncheckedCreateWithoutTaskInput>
  }

  export type MessageCreateManyTaskInputEnvelope = {
    data: MessageCreateManyTaskInput | MessageCreateManyTaskInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutAssignedTasksInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutAssignedTasksInput, UserUncheckedUpdateWithoutAssignedTasksInput>
    create: XOR<UserCreateWithoutAssignedTasksInput, UserUncheckedCreateWithoutAssignedTasksInput>
  }

  export type UserUpdateWithWhereUniqueWithoutAssignedTasksInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutAssignedTasksInput, UserUncheckedUpdateWithoutAssignedTasksInput>
  }

  export type UserUpdateManyWithWhereWithoutAssignedTasksInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutAssignedTasksInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phone?: StringFilter<"User"> | string
    address?: StringFilter<"User"> | string
    department?: StringFilter<"User"> | string
    isFirstLogin?: BoolFilter<"User"> | boolean
    createdAt?: StringFilter<"User"> | string
    createdBy?: StringFilter<"User"> | string
    themeMode?: StringFilter<"User"> | string
    themeColor?: StringFilter<"User"> | string
    status?: StringFilter<"User"> | string
    publicKey?: StringNullableFilter<"User"> | string | null
    encryptedPrivateKey?: StringNullableFilter<"User"> | string | null
  }

  export type UserUpsertWithoutCreatedTasksInput = {
    update: XOR<UserUpdateWithoutCreatedTasksInput, UserUncheckedUpdateWithoutCreatedTasksInput>
    create: XOR<UserCreateWithoutCreatedTasksInput, UserUncheckedCreateWithoutCreatedTasksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatedTasksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatedTasksInput, UserUncheckedUpdateWithoutCreatedTasksInput>
  }

  export type UserUpdateWithoutCreatedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTasks?: TaskUpdateManyWithoutAssigneesNestedInput
    accountRequests?: AccountRequestUpdateManyWithoutRequestedByNestedInput
    resolvedRequests?: AccountRequestUpdateManyWithoutResolvedByNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutCreatedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTasks?: TaskUncheckedUpdateManyWithoutAssigneesNestedInput
    accountRequests?: AccountRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    resolvedRequests?: AccountRequestUncheckedUpdateManyWithoutResolvedByNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type MessageUpsertWithWhereUniqueWithoutTaskInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutTaskInput, MessageUncheckedUpdateWithoutTaskInput>
    create: XOR<MessageCreateWithoutTaskInput, MessageUncheckedCreateWithoutTaskInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutTaskInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutTaskInput, MessageUncheckedUpdateWithoutTaskInput>
  }

  export type MessageUpdateManyWithWhereWithoutTaskInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutTaskInput>
  }

  export type UserCreateWithoutAccountRequestsInput = {
    id?: string
    username: string
    password: string
    role?: string
    fullName: string
    email: string
    phone?: string
    address?: string
    department?: string
    isFirstLogin?: boolean
    createdAt: string
    createdBy?: string
    themeMode?: string
    themeColor?: string
    status?: string
    publicKey?: string | null
    encryptedPrivateKey?: string | null
    assignedTasks?: TaskCreateNestedManyWithoutAssigneesInput
    createdTasks?: TaskCreateNestedManyWithoutAssignedByInput
    resolvedRequests?: AccountRequestCreateNestedManyWithoutResolvedByInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutAccountRequestsInput = {
    id?: string
    username: string
    password: string
    role?: string
    fullName: string
    email: string
    phone?: string
    address?: string
    department?: string
    isFirstLogin?: boolean
    createdAt: string
    createdBy?: string
    themeMode?: string
    themeColor?: string
    status?: string
    publicKey?: string | null
    encryptedPrivateKey?: string | null
    assignedTasks?: TaskUncheckedCreateNestedManyWithoutAssigneesInput
    createdTasks?: TaskUncheckedCreateNestedManyWithoutAssignedByInput
    resolvedRequests?: AccountRequestUncheckedCreateNestedManyWithoutResolvedByInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutAccountRequestsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountRequestsInput, UserUncheckedCreateWithoutAccountRequestsInput>
  }

  export type UserCreateWithoutResolvedRequestsInput = {
    id?: string
    username: string
    password: string
    role?: string
    fullName: string
    email: string
    phone?: string
    address?: string
    department?: string
    isFirstLogin?: boolean
    createdAt: string
    createdBy?: string
    themeMode?: string
    themeColor?: string
    status?: string
    publicKey?: string | null
    encryptedPrivateKey?: string | null
    assignedTasks?: TaskCreateNestedManyWithoutAssigneesInput
    createdTasks?: TaskCreateNestedManyWithoutAssignedByInput
    accountRequests?: AccountRequestCreateNestedManyWithoutRequestedByInput
    sentMessages?: MessageCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutResolvedRequestsInput = {
    id?: string
    username: string
    password: string
    role?: string
    fullName: string
    email: string
    phone?: string
    address?: string
    department?: string
    isFirstLogin?: boolean
    createdAt: string
    createdBy?: string
    themeMode?: string
    themeColor?: string
    status?: string
    publicKey?: string | null
    encryptedPrivateKey?: string | null
    assignedTasks?: TaskUncheckedCreateNestedManyWithoutAssigneesInput
    createdTasks?: TaskUncheckedCreateNestedManyWithoutAssignedByInput
    accountRequests?: AccountRequestUncheckedCreateNestedManyWithoutRequestedByInput
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput
    receivedMessages?: MessageUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutResolvedRequestsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutResolvedRequestsInput, UserUncheckedCreateWithoutResolvedRequestsInput>
  }

  export type UserUpsertWithoutAccountRequestsInput = {
    update: XOR<UserUpdateWithoutAccountRequestsInput, UserUncheckedUpdateWithoutAccountRequestsInput>
    create: XOR<UserCreateWithoutAccountRequestsInput, UserUncheckedCreateWithoutAccountRequestsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountRequestsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountRequestsInput, UserUncheckedUpdateWithoutAccountRequestsInput>
  }

  export type UserUpdateWithoutAccountRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTasks?: TaskUpdateManyWithoutAssigneesNestedInput
    createdTasks?: TaskUpdateManyWithoutAssignedByNestedInput
    resolvedRequests?: AccountRequestUpdateManyWithoutResolvedByNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTasks?: TaskUncheckedUpdateManyWithoutAssigneesNestedInput
    createdTasks?: TaskUncheckedUpdateManyWithoutAssignedByNestedInput
    resolvedRequests?: AccountRequestUncheckedUpdateManyWithoutResolvedByNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserUpsertWithoutResolvedRequestsInput = {
    update: XOR<UserUpdateWithoutResolvedRequestsInput, UserUncheckedUpdateWithoutResolvedRequestsInput>
    create: XOR<UserCreateWithoutResolvedRequestsInput, UserUncheckedCreateWithoutResolvedRequestsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutResolvedRequestsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutResolvedRequestsInput, UserUncheckedUpdateWithoutResolvedRequestsInput>
  }

  export type UserUpdateWithoutResolvedRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTasks?: TaskUpdateManyWithoutAssigneesNestedInput
    createdTasks?: TaskUpdateManyWithoutAssignedByNestedInput
    accountRequests?: AccountRequestUpdateManyWithoutRequestedByNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutResolvedRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
    assignedTasks?: TaskUncheckedUpdateManyWithoutAssigneesNestedInput
    createdTasks?: TaskUncheckedUpdateManyWithoutAssignedByNestedInput
    accountRequests?: AccountRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type TaskCreateManyAssignedByInput = {
    id?: string
    title: string
    description?: string
    status?: string
    priority?: string
    busyness?: string
    dueDate: string
    createdAt: string
    updatedAt: string
    notes?: string
  }

  export type AccountRequestCreateManyRequestedByInput = {
    id?: string
    requestedRole?: string
    fullName: string
    email: string
    department?: string
    reason: string
    status?: string
    createdAt: string
    resolvedAt?: string | null
    resolvedById?: string | null
    rejectionReason?: string | null
  }

  export type AccountRequestCreateManyResolvedByInput = {
    id?: string
    requestedById: string
    requestedRole?: string
    fullName: string
    email: string
    department?: string
    reason: string
    status?: string
    createdAt: string
    resolvedAt?: string | null
    rejectionReason?: string | null
  }

  export type MessageCreateManySenderInput = {
    id?: string
    receiverId: string
    ciphertext: string
    iv: string
    createdAt: string
    updatedAt?: string | null
    isEdited?: boolean
    deletedForSender?: boolean
    deletedForReceiver?: boolean
    taskId?: string | null
    read?: boolean
  }

  export type MessageCreateManyReceiverInput = {
    id?: string
    senderId: string
    ciphertext: string
    iv: string
    createdAt: string
    updatedAt?: string | null
    isEdited?: boolean
    deletedForSender?: boolean
    deletedForReceiver?: boolean
    taskId?: string | null
    read?: boolean
  }

  export type TaskUpdateWithoutAssigneesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    busyness?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    assignedBy?: UserUpdateOneRequiredWithoutCreatedTasksNestedInput
    linkedMessages?: MessageUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutAssigneesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    assignedById?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    busyness?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    linkedMessages?: MessageUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateManyWithoutAssigneesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    assignedById?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    busyness?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
  }

  export type TaskUpdateWithoutAssignedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    busyness?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    assignees?: UserUpdateManyWithoutAssignedTasksNestedInput
    linkedMessages?: MessageUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutAssignedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    busyness?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
    assignees?: UserUncheckedUpdateManyWithoutAssignedTasksNestedInput
    linkedMessages?: MessageUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateManyWithoutAssignedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    busyness?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: StringFieldUpdateOperationsInput | string
    notes?: StringFieldUpdateOperationsInput | string
  }

  export type AccountRequestUpdateWithoutRequestedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedRole?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    resolvedAt?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedBy?: UserUpdateOneWithoutResolvedRequestsNestedInput
  }

  export type AccountRequestUncheckedUpdateWithoutRequestedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedRole?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    resolvedAt?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedById?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountRequestUncheckedUpdateManyWithoutRequestedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedRole?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    resolvedAt?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedById?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountRequestUpdateWithoutResolvedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedRole?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    resolvedAt?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    requestedBy?: UserUpdateOneRequiredWithoutAccountRequestsNestedInput
  }

  export type AccountRequestUncheckedUpdateWithoutResolvedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedById?: StringFieldUpdateOperationsInput | string
    requestedRole?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    resolvedAt?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountRequestUncheckedUpdateManyWithoutResolvedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedById?: StringFieldUpdateOperationsInput | string
    requestedRole?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    resolvedAt?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    ciphertext?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    deletedForSender?: BoolFieldUpdateOperationsInput | boolean
    deletedForReceiver?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
    task?: TaskUpdateOneWithoutLinkedMessagesNestedInput
    receiver?: UserUpdateOneRequiredWithoutReceivedMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    ciphertext?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    deletedForSender?: BoolFieldUpdateOperationsInput | boolean
    deletedForReceiver?: BoolFieldUpdateOperationsInput | boolean
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    read?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MessageUncheckedUpdateManyWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    ciphertext?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    deletedForSender?: BoolFieldUpdateOperationsInput | boolean
    deletedForReceiver?: BoolFieldUpdateOperationsInput | boolean
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    read?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MessageUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    ciphertext?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    deletedForSender?: BoolFieldUpdateOperationsInput | boolean
    deletedForReceiver?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
    task?: TaskUpdateOneWithoutLinkedMessagesNestedInput
    sender?: UserUpdateOneRequiredWithoutSentMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    ciphertext?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    deletedForSender?: BoolFieldUpdateOperationsInput | boolean
    deletedForReceiver?: BoolFieldUpdateOperationsInput | boolean
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    read?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MessageUncheckedUpdateManyWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    ciphertext?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    deletedForSender?: BoolFieldUpdateOperationsInput | boolean
    deletedForReceiver?: BoolFieldUpdateOperationsInput | boolean
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
    read?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MessageCreateManyTaskInput = {
    id?: string
    senderId: string
    receiverId: string
    ciphertext: string
    iv: string
    createdAt: string
    updatedAt?: string | null
    isEdited?: boolean
    deletedForSender?: boolean
    deletedForReceiver?: boolean
    read?: boolean
  }

  export type UserUpdateWithoutAssignedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdTasks?: TaskUpdateManyWithoutAssignedByNestedInput
    accountRequests?: AccountRequestUpdateManyWithoutRequestedByNestedInput
    resolvedRequests?: AccountRequestUpdateManyWithoutResolvedByNestedInput
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutAssignedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
    createdTasks?: TaskUncheckedUpdateManyWithoutAssignedByNestedInput
    accountRequests?: AccountRequestUncheckedUpdateManyWithoutRequestedByNestedInput
    resolvedRequests?: AccountRequestUncheckedUpdateManyWithoutResolvedByNestedInput
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    receivedMessages?: MessageUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateManyWithoutAssignedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    isFirstLogin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    themeMode?: StringFieldUpdateOperationsInput | string
    themeColor?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    publicKey?: NullableStringFieldUpdateOperationsInput | string | null
    encryptedPrivateKey?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    ciphertext?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    deletedForSender?: BoolFieldUpdateOperationsInput | boolean
    deletedForReceiver?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
    sender?: UserUpdateOneRequiredWithoutSentMessagesNestedInput
    receiver?: UserUpdateOneRequiredWithoutReceivedMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    ciphertext?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    deletedForSender?: BoolFieldUpdateOperationsInput | boolean
    deletedForReceiver?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MessageUncheckedUpdateManyWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    ciphertext?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    createdAt?: StringFieldUpdateOperationsInput | string
    updatedAt?: NullableStringFieldUpdateOperationsInput | string | null
    isEdited?: BoolFieldUpdateOperationsInput | boolean
    deletedForSender?: BoolFieldUpdateOperationsInput | boolean
    deletedForReceiver?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaskCountOutputTypeDefaultArgs instead
     */
    export type TaskCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MessageDefaultArgs instead
     */
    export type MessageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MessageDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaskDefaultArgs instead
     */
    export type TaskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AccountRequestDefaultArgs instead
     */
    export type AccountRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AccountRequestDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}