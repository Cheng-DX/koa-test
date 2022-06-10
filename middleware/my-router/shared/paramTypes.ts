
type IsParameter<Part extends string> = Part extends `:${infer _ANYTHING}` ? Part : never

type FilteredParts<Path extends string> = Path extends `${infer A}/${infer B}`
  ? IsParameter<A> | FilteredParts<B>
  : IsParameter<Path>

type RemoveColon<T extends string> = T extends `:${infer U}` ? U : T

type MapToObject<T extends string> = {
  [K in T]: string
}

/**
 * Transfrom path like '/:name/sub/:number' to a type like { name: string, number: string }
 */
export type RouterParams<Path extends string> = {
  params: MapToObject<RemoveColon<FilteredParts<Path>>>
}


