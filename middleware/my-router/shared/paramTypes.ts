type IsParameter<Part extends string> =
  Part extends `:${infer _ANYNUMBER}` ? Part :
  Part extends `[${infer _ANYSTRING}]` ? Part : never

type FilteredParts<Path extends string> = Path extends `${infer A}/${infer B}`
  ? IsParameter<A> | FilteredParts<B>
  : IsParameter<Path>

type MapToObject<T> = {
  [Key in T as Key extends `:${infer U}` ? U : Key extends `[${infer U}]` ? U : never] : 
  Key extends `:${infer _ANY}` ? string : Key extends `[${infer _ANY}]` ? number : never;
}

export type RouterParams<Path extends string> = {
  params: MapToObject<FilteredParts<Path>>
}
